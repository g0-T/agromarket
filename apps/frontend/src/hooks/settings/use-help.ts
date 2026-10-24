// File: frontend/src/hooks/settings/use-help.ts
// Custom hook logic for React state and side effects.

import { useState, useMemo } from 'react';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getHelpStyles } from '@/styles/screens/dashboard/help.styles';
import { useWindowDimensions } from 'react-native';

const FAQ_ITEMS = [
    {
        icon: 'storefront' as const,
        question: '¿Cómo publico un lote de ganado?',
        answer: 'Ve a la pestaña "Publicar" en el menú de navegación. Completa el formulario con el tipo, categoría, raza, peso promedio y cantidad de cabezas. Adjunta fotos de calidad. Una vez enviado, nuestro equipo verificará la publicación en menos de 24 horas.',
    },
    {
        icon: 'verified' as const,
        question: '¿Qué significa el badge "Verificado"?',
        answer: 'El sello de verificación indica que el vendedor ha sido validado por nuestro equipo: documentación legal, guías de movilización y certificados sanitarios al día. Los lotes verificados generan hasta 3x más contactos.',
    },
    {
        icon: 'local-shipping' as const,
        question: '¿Cómo funciona el rastreo de pedidos?',
        answer: 'En la sección "Transacciones" puedes ver el estado en tiempo real de tus compras: Pendiente → En Tránsito → Completado. El vendedor actualiza el estado y puedes chatear directamente desde la tarjeta del pedido.',
    },
    {
        icon: 'attach-money' as const,
        question: '¿Cómo se calculan los precios en Bs.?',
        answer: 'Los precios se publican en USD y se convierten automáticamente usando la tasa oficial BCV del día. La conversión se actualiza diariamente y se muestra en el header del marketplace.',
    },
    {
        icon: 'chat-bubble-outline' as const,
        question: '¿Cómo contacto a un vendedor?',
        answer: 'Desde cualquier tarjeta de lote, presiona "OFERTAR" para iniciar una negociación. También puedes acceder al chat directamente desde el panel de Transacciones una vez que hayas enviado una oferta.',
    },
    {
        icon: 'security' as const,
        question: '¿Es seguro comprar en AgroMarket?',
        answer: 'Sí. Utilizamos verificación de identidad para vendedores, guías de movilización oficiales y un sistema de reputación. Recomendamos siempre verificar los documentos antes de cerrar cualquier transacción.',
    },
];

// Exported constant useHelp.
export const useHelp = (onBack: () => void) => {
    const { colors, styles } = useTheme(getHelpStyles);
    const [search, setSearch] = useState('');
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const handleGoBack = () => {
        onBack();
    };

    const filteredFaq = useMemo(() => {
        if (!search.trim()) return FAQ_ITEMS;
        const s = search.toLowerCase();
        return FAQ_ITEMS.filter(
            f => f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s)
        );
    }, [search]);

    return {
        search,
        setSearch,
        filteredFaq,
        isDesktop,
        colors,
        styles,
        handleGoBack,
    };
};