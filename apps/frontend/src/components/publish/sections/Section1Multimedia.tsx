// File: frontend/src/components/publish/sections/Section1Multimedia.tsx
// Section component for section 1 multimedia.

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SectionCard from '@/components/publish/SectionCard';
import { MediaItem } from '@/hooks/publish/use-publish-batch';

// Type declaration Section1MultimediaProps.
interface Section1MultimediaProps {
    styles: any;
    colors: any;
    isDesktop: boolean;
    mediaItems: MediaItem[];
    pickImage: () => void;
    setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

// Exported constant Section1Multimedia.
export const Section1Multimedia: React.FC<Section1MultimediaProps> = ({
    styles,
    colors,
    isDesktop,
    mediaItems,
    pickImage,
    setMediaItems,
}) => (
    <SectionCard styles={styles} style={isDesktop ? {} : styles.multimediaCard}>
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="camera-burst" size={20} color={colors.brand} />
            <Text style={styles.sectionTitle}>1. Fotos y Videos</Text>
        </View>
        <Text style={styles.label}>Sube contenido de alta calidad para vender más rápido.</Text>

        <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7} onPress={pickImage}>
            <View style={styles.cameraIconContainer}>
                <MaterialCommunityIcons name="camera-plus-outline" size={32} color="white" />
            </View>
            <Text style={{ color: colors.textColor, fontSize: 16, fontWeight: '800', marginTop: 4 }}>
                Añadir Multimedia
            </Text>
            <Text style={{ color: colors.mutedText, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                Máximo 10 fotos · 2 videos HD
            </Text>
        </TouchableOpacity>

        {mediaItems.length > 0 && (
            <View style={{ marginTop: 16 }}>
                <Text style={styles.label}>Archivos seleccionados ({mediaItems.length}/10)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {mediaItems.map((item, index) => (
                        <View key={index} style={styles.mediaItem}>
                            <View style={[styles.mediaPreview, item.type === 'video' && styles.mediaPreviewVideo]}>
                                {item.type === 'image' ? (
                                    <Image source={{ uri: item.uri }} style={styles.mediaPreviewImage} resizeMode="cover" />
                                ) : (
                                    <View style={styles.mediaVideoFallback}>
                                        <MaterialCommunityIcons name="video" size={28} color="#fff" />
                                    </View>
                                )}
                                {item.type === 'video' && (
                                    <View style={styles.mediaVideoOverlay}>
                                        <MaterialCommunityIcons name="play-circle-outline" size={32} color="#fff" />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.mediaName} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <TouchableOpacity
                                style={styles.mediaRemove}
                                onPress={() => setMediaItems(prev => prev.filter((_, i) => i !== index))}
                            >
                                <MaterialIcons name="close" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        )}

        <View style={styles.tipsRow}>
            {['Luz natural', 'Varios ángulos', 'Alta resolución'].map(tip => (
                <View key={tip} style={styles.tipChip}>
                    <MaterialIcons name="lightbulb" size={12} color={colors.brand} />
                    <Text style={styles.tipText}>{tip}</Text>
                </View>
            ))}
        </View>
    </SectionCard>
);
