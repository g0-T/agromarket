// File: frontend/src/hooks/publish/use-publish-batch.ts
// Custom hook logic for React state and side effects.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useCurrency } from '@/context/CurrencyContext';
import { FILTERS } from '@/constants/filters';
import productService from '@/services/product.service';
import logger from '@/utils/logger';
import * as ImagePicker from 'expo-image-picker';

// Type declaration MediaItem.
export type MediaItem = {
    uri: string;
    mimeType: string;
    name: string;
    kind: 'image' | 'video';
    type: 'image' | 'video';
};

type PickerState = {
    visible: boolean;
    options: string[];
    field: string;
    title: string;
};

// Exported constant usePublishBatch.
export const usePublishBatch = () => {
    const { user } = useAuth();
    const { bcvRate } = useCurrency();
    const router = useRouter();

    const [currentSection, setCurrentSection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [picker, setPicker] = useState<PickerState>({ visible: false, options: [], field: '', title: '' });

    const [formData, setFormData] = useState({
        title: '',
        type: FILTERS.TYPES[1],
        category: FILTERS.CATEGORIES[0],
        breedGroup: 'Cebú',
        breed: FILTERS.BREEDS['Cebú'][0],
        heads: '',
        weight: '',
        age: 'Desconocido',
        condition: 'Desconocido',
        location: FILTERS.LOCATIONS[0],
        currency: 'USD',
        price: '',
        description: '',
    });

    useEffect(() => {
        const breeds = FILTERS.BREEDS[formData.breedGroup as keyof typeof FILTERS.BREEDS];
        setFormData(prev => ({ ...prev, breed: breeds[0] }));
    }, [formData.breedGroup]);

    const openPicker = useCallback((field: string, title: string, options: string[]) => {
        setPicker({ visible: true, options, field, title });
    }, []);

    const handleSelect = useCallback((option: string) => {
        setFormData(prev => ({ ...prev, [picker.field]: option }));
        setPicker(prev => ({ ...prev, visible: false }));
    }, [picker.field]);

    const update = useCallback((key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleCurrencyChange = useCallback((nextCurrency: string) => {
        if (nextCurrency === formData.currency) return;
        const priceValue = parseFloat(formData.price);
        if (!formData.price || isNaN(priceValue)) {
            setFormData(prev => ({ ...prev, currency: nextCurrency }));
            return;
        }

        let convertedPrice = priceValue;
        if (formData.currency === 'USD' && nextCurrency === 'VES' && bcvRate > 0) {
            convertedPrice = priceValue * bcvRate;
        }
        if (formData.currency === 'VES' && nextCurrency === 'USD' && bcvRate > 0) {
            convertedPrice = priceValue / bcvRate;
        }

        setFormData(prev => ({
            ...prev,
            currency: nextCurrency,
            price: convertedPrice > 0 ? String(Number(convertedPrice.toFixed(2))) : prev.price,
        }));
    }, [bcvRate, formData.currency, formData.price]);

    const updateNumber = useCallback((key: string, value: string, allowDecimals: boolean = false) => {
        const regex = allowDecimals ? /[^0-9.]/g : /[^0-9]/g;
        let sanitized = value.replace(regex, '');

        if (allowDecimals) {
            const parts = sanitized.split('.');
            if (parts.length > 2) {
                sanitized = parts[0] + '.' + parts.slice(1).join('');
            }
        }
        update(key, sanitized);
    }, [update]);

    const priceNum = useMemo(() => parseFloat(formData.price) || 0, [formData.price]);
    const companyFee = useMemo(() => priceNum * 0.05, [priceNum]);
    const netIncome = useMemo(() => priceNum - companyFee, [priceNum, companyFee]);
    const isFormValid = useMemo(() => formData.title.length > 0 && formData.price.length > 0, [formData.title.length, formData.price.length]);

    const pickImage = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                quality: 1,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            const asset = result.assets[0];
            const isVideo = asset.type === 'video' || asset.uri.toLowerCase().endsWith('.mp4');
            const timestamp = Date.now();
            const mimeType = asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg');
            const extension = mimeType.includes('png') ? 'png' : mimeType.includes('jpg') || mimeType.includes('jpeg') ? 'jpg' : isVideo ? 'mp4' : 'jpg';
            const fileName = asset.fileName || `media_${timestamp}.${extension}`;

            if (isVideo) {
                const videoCount = mediaItems.filter(item => item.type === 'video').length;
                if (videoCount >= 2) {
                    Alert.alert('Límite de videos', 'Solo puedes subir hasta 2 videos.');
                    return;
                }

                const newVideo: MediaItem = {
                    uri: asset.uri,
                    type: 'video',
                    kind: 'video',
                    name: fileName,
                    mimeType,
                };

                setMediaItems(prev => [...prev, newVideo]);
                return;
            }

            const newImage: MediaItem = {
                uri: asset.uri,
                type: 'image',
                kind: 'image',
                name: fileName,
                mimeType,
            };
            setMediaItems(prev => [...prev, newImage]);
        } catch (globalError) {
            logger.error(globalError, { context: 'filePicker' });
            Alert.alert('Error', 'No se pudo seleccionar el archivo.');
        }
    }, [mediaItems]);

    const publish = useCallback(async () => {
        if (!isFormValid || isSubmitting) return;
        if (!user) {
            Alert.alert('Error', 'Debes estar autenticado para publicar.');
            return;
        }

        setIsSubmitting(true);
        try {
            const productData = {
                title: formData.title,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                currency: formData.currency,
                category: formData.category,
                breed: formData.breed,
                type: formData.type,
                weight: formData.weight || undefined,
                location: formData.location,
                heads: formData.heads ? parseInt(formData.heads) : undefined,
                age: formData.age,
                condition: formData.condition,
                img: undefined,
                sellerId: user.id,
            };
            const createdProduct = await productService.createProduct(productData);
            const productId = createdProduct.id;

            if (!productId) {
                Alert.alert('Error', 'No se pudo obtener el ID del producto creado.');
                setIsSubmitting(false);
                return;
            }

            if (mediaItems.length > 0) {
                const uploadErrors: string[] = [];
                for (const item of mediaItems) {
                    try {
                        await productService.updateProduct(productId, item);
                    } catch (uploadError: any) {
                        logger.error(uploadError, { context: 'fileUpload' });
                        uploadErrors.push(item.name || 'archivo');
                    }
                }

                if (uploadErrors.length > 0) {
                    Alert.alert('Publicación parcial', `El lote se publicó, pero no se pudieron subir ${uploadErrors.length} archivo(s).`);
                } else {
                    Alert.alert('¡Éxito!', 'Tu lote ha sido publicado.');
                }
            } else {
                Alert.alert('¡Éxito!', 'Tu lote ha sido publicado.');
            }
            setFormData({
                title: '',
                type: FILTERS.TYPES[1],
                category: FILTERS.CATEGORIES[0],
                breedGroup: 'Cebú',
                breed: FILTERS.BREEDS['Cebú'][0],
                heads: '',
                weight: '',
                age: 'Desconocido',
                condition: 'Desconocido',
                location: FILTERS.LOCATIONS[0],
                currency: 'USD',
                price: '',
                description: '',
            });
            setMediaItems([]);
            setCurrentSection(1);
            router.push(`/(lots)/${productId}`);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'No se pudo publicar el lote.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, isFormValid, isSubmitting, mediaItems, router, user]);

    return {
        currentSection,
        setCurrentSection,
        isSubmitting,
        mediaItems,
        formData,
        picker,
        openPicker,
        handleSelect,
        update,
        updateNumber,
        handleCurrencyChange,
        priceNum,
        companyFee,
        netIncome,
        isFormValid,
        pickImage,
        publish,
        setMediaItems,
        setPicker,
    };
};
