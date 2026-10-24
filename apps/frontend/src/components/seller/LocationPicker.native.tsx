// File: frontend/src/components/seller/LocationPicker.tsx
// Picker component for location picker native.
// Interactive map component for selecting farm location using free OpenStreetMap tiles.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import logger from '@/utils/logger';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

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

// Component for location picker.
export const LocationPicker: React.FC<LocationPickerProps> = ({
    initialLocation,
    onLocationSelect,
    onClose,
    colors,
    styles,
}) => {
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(initialLocation || null);
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [region, setRegion] = useState({
        latitude: initialLocation?.lat || 10.5061,
        longitude: initialLocation?.lng || -66.9146,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        if (!initialLocation) {
            getCurrentLocation();
        } else {
            setRegion({
                latitude: initialLocation.lat,
                longitude: initialLocation.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [initialLocation]);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a la ubicación para mostrar el mapa.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const newLocation = { lat: latitude, lng: longitude };
            setCurrentLocation(newLocation);
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Get address for current location
            await reverseGeocode(latitude, longitude);
        } catch (error) {
            Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
        }
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const address = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (address.length > 0) {
                const addr = address[0];
                const fullAddress = [
                    addr.name,
                    addr.street,
                    addr.district,
                    addr.city,
                    addr.region,
                    addr.country
                ].filter(Boolean).join(', ');

                setCurrentLocation(prev => prev ? { ...prev, address: fullAddress } : { lat, lng, address: fullAddress });
                setSearchText(fullAddress);
                return fullAddress;
            }
        } catch (error) {
            logger.error(error, { context: 'LocationPicker.reverseGeocode' });
        }

        const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setSearchText(fallback);
        return fallback;
    };

    const searchLocation = async () => {
        if (!searchText.trim()) return;

        setIsSearching(true);
        try {
            const results = await Location.geocodeAsync(searchText);
            if (results.length > 0) {
                const { latitude, longitude } = results[0];
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                };

                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);

                const newLocation = { lat: latitude, lng: longitude };
                setCurrentLocation(newLocation);
                await reverseGeocode(latitude, longitude);
            } else {
                Alert.alert('No encontrado', 'No se pudo encontrar la ubicación buscada.');
            }
        } catch (error) {
            Alert.alert('Error', 'Error al buscar la ubicación.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const newLocation = { lat: latitude, lng: longitude, address: currentLocation?.address };
        setCurrentLocation(newLocation);
        await reverseGeocode(latitude, longitude);
    };

    const handleAddressChange = (address: string) => {
        setCurrentLocation((prev) => (prev ? { ...prev, address } : null));
    };

    const handleConfirm = () => {
        if (currentLocation) {
            onLocationSelect(currentLocation);
        }
    };

    return (
        <View style={styles.locationPickerContainer}>
            <View style={styles.locationPickerCard}>
                <View style={styles.locationPickerHeader}>
                    <Text style={styles.locationPickerTitle}>Seleccionar ubicación de la finca</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color={colors.textColor} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.locationPickerHint}>
                    Mueve el pin, busca por nombre o usa tu ubicación actual para fijar la finca con precisión.
                </Text>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar lugar..."
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={searchLocation}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={searchLocation}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <MaterialIcons name="search" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={[styles.map, { height: 320 }]}
                        region={region}
                        onRegionChangeComplete={setRegion}
                        onPress={handleMapPress}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        {currentLocation && (
                            <Marker
                                coordinate={{
                                    latitude: currentLocation.lat,
                                    longitude: currentLocation.lng,
                                }}
                                title="Ubicación de la finca"
                                description={currentLocation.address}
                                pinColor="#28a745"
                                draggable
                                onDragEnd={(event) => {
                                    const { latitude, longitude } = event.nativeEvent.coordinate;
                                    const newLocation = { lat: latitude, lng: longitude };
                                    setCurrentLocation(newLocation);
                                    reverseGeocode(latitude, longitude);
                                }}
                            />
                        )}
                    </MapView>
                </View>

                <Text style={styles.locationNote}>
                    Usa "Mi ubicación" para centrar el mapa en tu posición actual, o arrastra el marcador sobre la finca para mayor precisión.
                </Text>

                {currentLocation && (
                    <>
                        <View style={styles.locationPickerInfo}>
                            <Text style={styles.locationCoords}>
                                Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                            </Text>
                            {currentLocation.address ? (
                                <Text style={styles.locationPickerAddress}>{currentLocation.address}</Text>
                            ) : (
                                <Text style={styles.locationPickerAddress}>
                                    No se obtuvo una dirección automática; puedes escribir una referencia.
                                </Text>
                            )}
                        </View>

                        <View style={{ marginTop: 12 }}>
                            <Text style={styles.locationFieldLabel}>Dirección o referencia de la finca</Text>
                            <TextInput
                                style={[styles.searchInput, { marginTop: 8 }]}
                                placeholder="Ej. Hacienda Los Pinos, Valencia"
                                placeholderTextColor={colors.mutedText}
                                value={currentLocation.address || ''}
                                onChangeText={handleAddressChange}
                            />
                        </View>
                    </>
                )}

                <View style={styles.locationActions}>
                    <TouchableOpacity
                        style={styles.locationButtonSecondary}
                        onPress={getCurrentLocation}
                    >
                        <MaterialIcons name="my-location" size={20} color={colors.brand} />
                        <Text style={styles.locationButtonSecondaryText}>Mi ubicación</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.locationButtonPrimary, !currentLocation && styles.locationButtonDisabled]}
                        onPress={handleConfirm}
                        disabled={!currentLocation}
                    >
                        <MaterialIcons name="check" size={20} color="#fff" />
                        <Text style={styles.locationButtonPrimaryText}>Confirmar ubicación</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
