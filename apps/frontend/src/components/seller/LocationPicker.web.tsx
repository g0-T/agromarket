// File: frontend/src/components/seller/LocationPicker.web.tsx
// Picker component for location picker web.
// Web fallback for location selection when react-native-maps is not available.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Animated, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Load Leaflet CSS/JS from CDN on web; we mount a global L map instance into a div.
const LEAFLET_CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
const LEAFLET_SCRIPT_URL = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';

declare const L: any;

const useLeafletCss = () => {
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const existing = document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`);
        if (existing) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = LEAFLET_CSS_URL;
        link.crossOrigin = '';
        document.head.appendChild(link);
    }, []);
};

const useLeafletScript = () => {
    const [loaded, setLoaded] = React.useState(false);
    useEffect(() => {
        if (typeof document === 'undefined') return;
        if ((window as any).L) {
            setLoaded(true);
            return;
        }
        const existing = document.querySelector(`script[src="${LEAFLET_SCRIPT_URL}"]`);
        if (existing) {
            existing.addEventListener('load', () => setLoaded(true));
            return;
        }
        const script = document.createElement('script');
        script.src = LEAFLET_SCRIPT_URL;
        script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
    }, []);
    return loaded;
};

// Type declaration LocationData.
interface LocationData {
    lat: number;
    lng: number;
    address?: string;
}

interface LocationPickerProps {
    initialLocation?: LocationData;
    onLocationSelect: (location: LocationData) => void;
    onClose: () => void;
    colors: any;
    styles: any;
}

// Component for iframe.
export const LocationPicker: React.FC<LocationPickerProps> = ({
    initialLocation,
    onLocationSelect,
    onClose,
    colors,
    styles,
}) => {
    const [searchText, setSearchText] = useState(initialLocation?.address || '');
    const [lat, setLat] = useState(initialLocation?.lat?.toString() || '');
    const [lng, setLng] = useState(initialLocation?.lng?.toString() || '');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const skipSearchRef = useRef(false);

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    useEffect(() => {
        if (skipSearchRef.current) {
            skipSearchRef.current = false;
            return;
        }
        if (searchText.trim()) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => {
                searchLocation();
            }, 500);
        } else {
            setSearchResults([]);
        }
        return () => clearTimeout(searchTimeoutRef.current);
    }, [searchText]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    const center = useMemo<[number, number] | undefined>(() => {
        const latValue = parseFloat(lat);
        const lngValue = parseFloat(lng);
        if (Number.isNaN(latValue) || Number.isNaN(lngValue)) {
            return undefined;
        }
        return [latValue, lngValue];
    }, [lat, lng]);

    const hasValidLocation = Boolean(center);

    useEffect(() => {
        if (!center) return;
        if (searchText.trim()) return;
        skipSearchRef.current = true;
        setSearchText(`${center[0].toFixed(6)}, ${center[1].toFixed(6)}`);
    }, [center]);

    const handleConfirm = () => {
        const latValue = parseFloat(lat);
        const lngValue = parseFloat(lng);

        if (Number.isNaN(latValue) || Number.isNaN(lngValue)) {
            Alert.alert('Coordenadas inválidas', 'Ingresa un valor numérico válido para latitud y longitud.');
            return;
        }

        onLocationSelect({ lat: latValue, lng: lngValue, address: searchText.trim() || `${latValue.toFixed(6)}, ${lngValue.toFixed(6)}` });
    };

    useLeafletCss();
    const leafletLoaded = useLeafletScript();

    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        if (!leafletLoaded || !center || mapRef.current) return;

        const container = document.getElementById('agromarket-map');
        if (!container) return;

        const greenIcon = L.divIcon({
            className: 'agromarket-map-marker',
            html: '<div style="background:#28a745;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 0 0 4px rgba(40,167,69,0.15)"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
        });

        const map = L.map(container).setView(center, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const marker = L.marker(center, { icon: greenIcon }).addTo(map);
        mapRef.current = map;
        markerRef.current = marker;

        const onClick = async (e: any) => {
            skipSearchRef.current = true;
            const latVal = e.latlng.lat.toFixed(6);
            const lngVal = e.latlng.lng.toFixed(6);
            setLat(latVal);
            setLng(lngVal);
            markerRef.current?.setLatLng(e.latlng);

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latVal}&lon=${lngVal}&accept-language=es`
                );
                const data = await response.json();
                if (data.display_name) {
                    setSearchText(data.display_name);
                    setSearchResults([]);
                } else {
                    setSearchText(`${latVal}, ${lngVal}`);
                }
            } catch {
                setSearchText(`${latVal}, ${lngVal}`);
            }
        };

        map.on('click', onClick);
    }, [leafletLoaded, center]);

    useEffect(() => {
        if (!leafletLoaded || !center || !mapRef.current) return;
        mapRef.current.panTo(center);
        markerRef.current?.setLatLng(center);
    }, [leafletLoaded, center]);

    useEffect(() => {
        return () => {
            if (mapRef.current) {
                try {
                    mapRef.current.remove();
                } catch (e) {
                    // ignore
                }
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    const useBrowserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a la ubicación para obtener tu posición actual.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const latValue = location.coords.latitude.toString();
            const lngValue = location.coords.longitude.toString();
            setLat(latValue);
            setLng(lngValue);

            // Clear search results when setting current location
            setSearchResults([]);

            // Reverse geocoding to get address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latValue}&lon=${lngValue}&accept-language=es`
                );
                const data = await response.json();
                skipSearchRef.current = true;
                if (data.display_name) {
                    setSearchText(data.display_name);
                    setSearchResults([]);
                } else {
                    setSearchText(`${latValue}, ${lngValue}`);
                }
            } catch (error) {
                skipSearchRef.current = true;
                setSearchText(`${latValue}, ${lngValue}`);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
        }
    };

    const searchLocation = async () => {
        if (!searchText.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&autocomplete=1&q=${encodeURIComponent(searchText)}&limit=5&countrycodes=VE&accept-language=es`
            );
            const data = await response.json();

            setSearchResults(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudo buscar la ubicación en web.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Animated.View style={[styles.locationPickerContainer, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.locationPickerCard, { transform: [{ translateY: slideAnim }] }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
                    <View style={styles.locationPickerHeader}>
                        <Text style={styles.locationPickerTitle}>Seleccionar ubicación de la finca</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={colors.textColor} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.locationPickerHint}>
                        En web tienes un formulario con coordenadas y una vista previa del mapa.
                    </Text>

                    <View style={styles.searchWrapper}>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar dirección o nombre de lugar"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            <TouchableOpacity
                                style={styles.searchButton}
                                onPress={searchLocation}
                                disabled={isSearching}
                            >
                                <MaterialIcons
                                    name={isSearching ? 'hourglass-top' : 'search'}
                                    size={20}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>
                        {searchResults.length > 0 && searchText.trim() && (
                            <View style={styles.searchResultsContainer}>
                                {searchResults.map((result, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.searchResultItem}
                                        onPress={() => {
                                            skipSearchRef.current = true;
                                            setLat(result.lat);
                                            setLng(result.lon);
                                            setSearchText(result.display_name);
                                            setSearchResults([]);
                                        }}
                                    >
                                        <Text style={styles.searchResultText}>{result.display_name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.locationGrid}>
                        <View style={styles.locationFieldBlock}>
                            <Text style={styles.locationFieldLabel}>Latitud</Text>
                            <TextInput
                                style={styles.searchInput}
                                value={lat}
                                onChangeText={setLat}
                                keyboardType="numeric"
                                placeholder="Ej. 10.5061"
                            />
                        </View>
                        <View style={styles.locationFieldBlock}>
                            <Text style={styles.locationFieldLabel}>Longitud</Text>
                            <TextInput
                                style={styles.searchInput}
                                value={lng}
                                onChangeText={setLng}
                                keyboardType="numeric"
                                placeholder="Ej. -66.9146"
                            />
                        </View>
                    </View>

                    {hasValidLocation && center && (
                        <View style={styles.mapPreviewContainer}>
                            <Text style={styles.mapPreviewTitle}>Vista previa de ubicación</Text>
                            <View
                                style={[
                                    styles.mapPreviewFrame,
                                    {
                                        height: 280,
                                        width: '100%',
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                    },
                                ]}
                            >
                                <div id="agromarket-map" style={{ height: '100%', width: '100%' }} />
                            </View>
                        </View>
                    )}

                    <Text style={styles.locationNote}>
                        Usa el buscador o tu ubicación para obtener coordenadas precisas; el mapa se actualizará automáticamente.
                    </Text>

                    <View style={styles.locationActions}>
                        <TouchableOpacity
                            style={styles.locationButtonSecondary}
                            onPress={useBrowserLocation}
                        >
                            <MaterialIcons name="my-location" size={20} color={colors.brand} />
                            <Text style={styles.locationButtonSecondaryText}>Ubicación actual</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.locationButtonPrimary}
                            onPress={handleConfirm}
                        >
                            <MaterialIcons name="check" size={20} color="#fff" />
                            <Text style={styles.locationButtonPrimaryText}>Confirmar ubicación</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        </Animated.View>
    );
};
