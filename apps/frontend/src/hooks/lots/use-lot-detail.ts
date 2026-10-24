// File: frontend/src/hooks/lots/use-lot-detail.ts
// Custom hook logic for React state and side effects.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency, formatBS } from '@/utils/currency';
import productService, { Product } from '@/services/product.service';
import logger from '@/utils/logger';
import transactionService from '@/services/transaction.service';
import favoriteService from '@/services/favorite.service';
import notificationEventsService from '@/services/notification-events.service';
import { useWindowDimensions } from 'react-native';

type GalleryItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    filename?: string;
};

// Exported constant useLotDetail.
export const useLotDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { bcvRate } = useCurrency();
    const { user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [alreadyOffered, setAlreadyOffered] = useState<boolean | null>(null);
    const [offerStatusLoading, setOfferStatusLoading] = useState(true);
    const [isOfferLoading, setIsOfferLoading] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [buyerDeliveryAddress, setBuyerDeliveryAddress] = useState('');

    const loadProduct = useCallback(async () => {
        try {
            const data = await productService.getProduct(Number(id));
            setProduct(data);
        } catch (e) {
            logger.error(e, { context: 'loadProduct' });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadProduct(); }, [loadProduct]);

    useEffect(() => {
        if (!user || !product) return;
        setOfferStatusLoading(true);

        transactionService.listUserTransactions()
            .then(txs => {
                const found = txs.some(tx => tx.buyerId === user.id && tx.product?.id === product.id);
                setAlreadyOffered(found);
            })
            .catch(err => {
                logger.error(err, { context: 'Failed to load offered status', userId: user.id, productId: product.id });
                setAlreadyOffered(false);
            })
            .finally(() => {
                setOfferStatusLoading(false);
            });
    }, [user, product]);

    useEffect(() => {
        if (!user || !product) {
            setSaved(false);
            return;
        }

        favoriteService.isProductFavorite(product.id)
            .then(setSaved)
            .catch(() => {

            });
    }, [user, product]);

    const priceConversion = useMemo(() => {
        if (!product?.price) return { label: '', value: '' };

        const amount = Number(product.price);
        const currency = product.currency || 'USD';

        if (!bcvRate || bcvRate === 0) {
            return { label: '', value: '' };
        }

        if (currency === 'USD') {
            const converted = amount * bcvRate;
            return { label: '≈', value: formatBS(converted) };
        }

        const converted = amount / bcvRate;
        return { label: '≈ USD', value: formatCurrency(converted, 'USD') };
    }, [product?.price, product?.currency, bcvRate]);

    const stats = useMemo(() => [
        { iconName: 'cow', iconType: 'MaterialCommunityIcons', label: 'Cabezas', value: product?.heads ? `${product.heads}` : '—' },
        { iconName: 'weight-kilogram', iconType: 'MaterialCommunityIcons', label: 'Peso prom.', value: product?.weight ? `${product.weight} kg` : '—' },
        { iconName: 'calendar-today', iconType: 'MaterialIcons', label: 'Edad', value: product?.age ?? '—' },
        { iconName: 'healing', iconType: 'MaterialIcons', label: 'Condición', value: product?.condition ?? 'Buena' },
    ], [product]);

    const details = useMemo((): { icon: string; label: string; value: string }[] => {
        if (!product) return [];
        return [
            { icon: 'label', label: 'Categoría', value: product.category || '—' },
            { icon: 'location-on', label: 'Ubicación', value: product.location || '—' },
            ...(product.breed ? [{ icon: 'pets', label: 'Raza', value: product.breed }] : []),
            ...(product.type ? [{ icon: 'label', label: 'Tipo', value: product.type }] : []),
        ];
    }, [product]);

    const isOwnProduct = useMemo(() => Boolean(user && product && user.id === product.sellerId), [user, product]);
    const offerButtonLabel = useMemo(() => {
        if (isOwnProduct) return 'Este es tu lote';
        if (offerStatusLoading) return 'Cargando...';
        if (isOfferLoading) return 'Enviando...';
        return alreadyOffered ? 'Oferta Enviada' : 'Enviar Oferta';
    }, [isOwnProduct, alreadyOffered, offerStatusLoading, isOfferLoading]);
    const offerButtonDisabled = useMemo(
        () => isOwnProduct || offerStatusLoading || isOfferLoading || alreadyOffered === true,
        [isOwnProduct, offerStatusLoading, isOfferLoading, alreadyOffered]
    );

    const toggleFavorite = useCallback(async () => {
        if (!product) return;
        const nextSaved = !saved;
        setSaved(nextSaved);
        try {
            if (nextSaved) {
                await favoriteService.addFavorite(product.id);
            } else {
                await favoriteService.removeFavorite(product.id);
            }
        } catch (err) {
            logger.error(err, { context: 'favoriteToggle' });
            setSaved(!nextSaved);
            Alert.alert('Error', 'No se pudo actualizar tus favoritos.');
        }
    }, [product, saved]);

    const handleOfferPress = useCallback(async () => {
        if (!product || offerButtonDisabled) return;
        setIsOfferLoading(true);

        try {
            await transactionService.createTransaction({
                productId: product.id,
                amount: product.price,
                currency: product.currency || 'VES',
                buyerDeliveryAddress: buyerDeliveryAddress?.trim() || undefined,
            });

            setAlreadyOffered(true);

            // Send notification to seller
            if (user?.id && product.sellerId) {
                await notificationEventsService.notifyNewOffer(
                    product.id,
                    user.id,
                    product.sellerId,
                    product.price
                );
            }

            Alert.alert('Éxito', 'Oferta enviada.');
            router.push('/Transactions?tab=purchases');
        } catch (e: any) {
            logger.warn('tx error', { error: e });
            const message = (e?.response?.data?.message || '').toString().toLowerCase();
            if (message.includes('reservado') || message.includes('proceso de venta') || message.includes('reserved') || message.includes('in process')) {
                Alert.alert('Lote reservado', 'Este lote ya está reservado o en proceso de venta. Intenta con otro lote.');
            } else {
                Alert.alert(
                    'Error',
                    e?.response?.data?.message || 'No se pudo enviar la oferta. Intenta nuevamente en unos segundos.'
                );
            }
        } finally {
            setIsOfferLoading(false);
        }
    }, [product, offerButtonDisabled, router, user?.id, buyerDeliveryAddress]);

    const galleryItems = useMemo(() => {
        if (!product) return [];

        const attachments: Array<{ id: string; url: string; type: 'image' | 'video'; filename?: string }> =
            (product.attachments?.map(att => ({
                id: att.id,
                url: att.url,
                type: att.mimeType?.startsWith('video/') ? 'video' : 'image',
                filename: att.filename,
            })) || []);

        const items: Array<{ id: string; url: string; type: 'image' | 'video'; filename?: string }> = [];
        const seen = new Set<string>();

        if (product.img) {
            const coverType: 'image' | 'video' = attachments.find(att => att.url === product.img)?.type || 'image';
            items.push({ id: 'cover', url: product.img, type: coverType });
            seen.add(product.img);
        }

        for (const attachment of attachments) {
            if (seen.has(attachment.url)) continue;
            seen.add(attachment.url);
            items.push(attachment);
        }

        return items;
    }, [product]);

    useEffect(() => {
        if (galleryItems.length === 0) {
            setSelectedMediaIndex(0);
            return;
        }
        if (selectedMediaIndex >= galleryItems.length) {
            setSelectedMediaIndex(0);
        }
    }, [galleryItems, selectedMediaIndex]);

    return {
        product,
        loading,
        saved,
        stats,
        alreadyOffered,
        selectedMediaIndex,
        setSelectedMediaIndex,
        priceConversion,
        details,
        isOwnProduct,
        offerButtonLabel,
        offerButtonDisabled,
        isOfferLoading,
        toggleFavorite,
        handleOfferPress,
        buyerDeliveryAddress,
        setBuyerDeliveryAddress,
        galleryItems,
    };
};