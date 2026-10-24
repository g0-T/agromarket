// File: frontend/src/components/lots/MediaViewer.tsx
// Component for media viewer.

import React, { useCallback, useRef, useState } from 'react';
import { View, TouchableOpacity, Modal, Platform, ScrollView, Text } from 'react-native';
import { Image } from 'expo-image';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getThemeColors } from '@/constants/theme';
import logger from '@/utils/logger';

// Type declaration ThemeColors.
type ThemeColors = ReturnType<typeof getThemeColors>;

type GalleryItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    filename?: string;
};

interface MediaViewerProps {
    galleryItems: GalleryItem[];
    selectedMediaIndex: number;
    setSelectedMediaIndex: (index: number) => void;
    colors: ThemeColors;
    onBack: () => void;
    onFavorite: () => void;
    saved: boolean;
}

// Component for media viewer.
const MediaViewer: React.FC<MediaViewerProps> = ({
    galleryItems,
    selectedMediaIndex,
    setSelectedMediaIndex,
    colors,
    onBack,
    onFavorite,
    saved,
}) => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 980;

    const [isPortraitVideo, setIsPortraitVideo] = useState(false);
    const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null);
    const [isVideoPlayingState, setIsVideoPlayingState] = useState(false);
    const [fullscreenAutoPlay, setFullscreenAutoPlay] = useState(false);
    const previewVideoRef = useRef<any>(null);
    const fullscreenVideoRef = useRef<any>(null);

    const handleVideoStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        setPlaybackStatus(status);
        if (status && 'isPlaying' in status) {
            setIsVideoPlayingState(status.isPlaying);
        }
    }, []);

    const toggleVideoPlayback = useCallback(async () => {
        const currentVideo = isMediaFullscreen ? fullscreenVideoRef.current : previewVideoRef.current;
        if (!currentVideo) return;

        if (Platform.OS === 'web') {
            const htmlVideo = currentVideo as HTMLVideoElement;
            try {
                if (htmlVideo.paused) {
                    await htmlVideo.play();
                    setIsVideoPlayingState(true);
                } else {
                    htmlVideo.pause();
                    setIsVideoPlayingState(false);
                }
            } catch (err) {
                logger.error(err, { context: 'videoPlaybackToggle' });
            }
            return;
        }

        try {
            if (isVideoPlayingState) {
                await (currentVideo as Video).pauseAsync();
                setIsVideoPlayingState(false);
            } else {
                await (currentVideo as Video).playAsync();
                setIsVideoPlayingState(true);
            }
        } catch (err) {
            logger.error(err, { context: 'videoPlaybackToggle' });
        }
    }, [isMediaFullscreen, isVideoPlayingState]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    const pauseVideoElement = useCallback(async (video: any) => {
        if (!video) return;
        try {
            if (Platform.OS === 'web') {
                if (!video.paused) {
                    video.pause();
                }
                return;
            }
            if (typeof video.pauseAsync === 'function') {
                await video.pauseAsync();
            }
        } catch (err) {
            logger.error(err, { context: 'pauseVideo' });
        }
    }, []);

    const openMediaFullscreen = useCallback(() => {
        setIsMediaFullscreen(true);
    }, []);

    const closeMediaFullscreen = useCallback(async () => {
        if (fullscreenVideoRef.current) {
            await pauseVideoElement(fullscreenVideoRef.current);
        }
        setIsMediaFullscreen(false);
        setFullscreenAutoPlay(false);
        setIsVideoPlayingState(false);
    }, [pauseVideoElement]);

    const handleReadyForDisplay = useCallback((event: any) => {
        const naturalSize = event?.naturalSize;
        if (naturalSize && naturalSize.height > naturalSize.width) {
            setIsPortraitVideo(true);
        } else {
            setIsPortraitVideo(false);
        }
    }, []);

    const handleWebVideoLoad = useCallback((event: any) => {
        const video = event.currentTarget;
        if (video?.videoWidth && video?.videoHeight) {
            setIsPortraitVideo(video.videoHeight > video.videoWidth);
        }
    }, []);

    const goPrevMedia = useCallback(() => {
        if (galleryItems.length === 0) return;
        const newIndex = selectedMediaIndex === 0 ? galleryItems.length - 1 : selectedMediaIndex - 1;
        setSelectedMediaIndex(newIndex);
    }, [galleryItems.length, selectedMediaIndex, setSelectedMediaIndex]);

    const goNextMedia = useCallback(() => {
        if (galleryItems.length === 0) return;
        const newIndex = selectedMediaIndex === galleryItems.length - 1 ? 0 : selectedMediaIndex + 1;
        setSelectedMediaIndex(newIndex);
    }, [galleryItems.length, selectedMediaIndex, setSelectedMediaIndex]);

    React.useEffect(() => {
        if (!isMediaFullscreen || galleryItems[selectedMediaIndex]?.type !== 'video') return;

        const shouldPlay = isVideoPlayingState;
        setFullscreenAutoPlay(shouldPlay);

        const pausePreview = async () => {
            if (previewVideoRef.current) {
                await pauseVideoElement(previewVideoRef.current);
            }
            setIsVideoPlayingState(shouldPlay);
        };

        pausePreview();
    }, [isMediaFullscreen, galleryItems, selectedMediaIndex, isVideoPlayingState, pauseVideoElement]);

    return (
        <>
            <View style={{
                height: isDesktop ? 460 : 300,
                overflow: 'hidden',
                backgroundColor: colors.brand + '33',
                borderRadius: isDesktop ? 24 : 0,
                marginTop: 0,
            }}>
                <View style={{ flex: 1, backgroundColor: '#000', overflow: 'hidden' }}>
                    {galleryItems[selectedMediaIndex] ? (
                        galleryItems[selectedMediaIndex].type === 'image' ? (
                            <Image
                                source={{ uri: galleryItems[selectedMediaIndex].url }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={{ flex: 1, backgroundColor: '#000' }}>
                                {Platform.OS === 'web' ? (
                                    <video
                                        ref={(ref) => { previewVideoRef.current = ref; }}
                                        src={galleryItems[selectedMediaIndex].url}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: isPortraitVideo ? 'contain' : 'cover',
                                            backgroundColor: '#000'
                                        }}
                                        muted={isMuted}
                                        controls={false}
                                        onLoadedMetadata={handleWebVideoLoad}
                                        onPlay={() => setIsVideoPlayingState(true)}
                                        onPause={() => setIsVideoPlayingState(false)}
                                    />
                                ) : (
                                    <Video
                                        ref={previewVideoRef}
                                        source={{ uri: galleryItems[selectedMediaIndex].url }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode={isPortraitVideo ? ResizeMode.CONTAIN : ResizeMode.COVER}
                                        useNativeControls={false}
                                        isMuted={isMuted}
                                        onPlaybackStatusUpdate={handleVideoStatusUpdate}
                                        onReadyForDisplay={handleReadyForDisplay}
                                    />
                                )}
                                <View style={{
                                    position: 'absolute', bottom: 14,
                                    right: 14,
                                    flexDirection: 'row',
                                    gap: 10,
                                }}>
                                    <TouchableOpacity
                                        onPress={toggleVideoPlayback}
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 12,
                                            backgroundColor: 'rgba(0,0,0,0.55)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <MaterialIcons
                                            name={isVideoPlayingState ? 'pause' : 'play-arrow'}
                                            size={22}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>)
                    ) : (
                        <View style={{
                            flex: 1,
                            backgroundColor: colors.brand + '18',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MaterialIcons name="pets" size={80} color={colors.brand + '60'} />
                        </View>
                    )}
                </View>
                <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons name="arrow-back-ios" size={18} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onFavorite}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: saved ? '#fff' : 'rgba(0,0,0,0.55)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={20} color={saved ? '#f59e0b' : '#fff'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={goPrevMedia}
                    style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: [{ translateY: -20 }],
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons name="chevron-left" size={26} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={goNextMedia}
                    style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: [{ translateY: -20 }],
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons name="chevron-right" size={26} color="#fff" />
                </TouchableOpacity>
                {galleryItems[selectedMediaIndex]?.type === 'video' && (
                    <TouchableOpacity
                        onPress={toggleMute}
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 110,
                            width: 38,
                            height: 38,
                            borderRadius: 12,
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons name={isMuted ? 'volume-off' : 'volume-up'} size={20} color="#fff" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={openMediaFullscreen}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 64,
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons name="fullscreen" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {galleryItems.length > 1 && (
                <>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: isDesktop ? 0 : 16,
                        marginTop: 12,
                    }}>
                        <View style={{
                            backgroundColor: colors.brand,
                            borderRadius: 20,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <MaterialIcons name="verified" size={14} color="#fff" />
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>LOTE VERIFICADO</Text>
                        </View>
                        <View style={{
                            backgroundColor: 'rgba(0,0,0,0.45)',
                            borderRadius: 18,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <MaterialIcons name="photo-library" size={14} color="#fff" />
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                                {`${selectedMediaIndex + 1}/${galleryItems.length || 1}`}
                            </Text>
                        </View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16, paddingLeft: isDesktop ? 24 : 16 }}>
                        {galleryItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.8}
                                onPress={() => setSelectedMediaIndex(index)}
                                style={{
                                    marginRight: 12,
                                    borderWidth: selectedMediaIndex === index ? 2 : 1,
                                    borderColor: selectedMediaIndex === index ? colors.brand : colors.mutedText + '22',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                }}
                            >
                                {item.type === 'image' ? (
                                    <Image
                                        source={{ uri: item.url }}
                                        style={{ width: 96, height: 72 }}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={{ width: 96, height: 72, backgroundColor: colors.mutedText + '22', justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons name="play-circle-outline" size={28} color={colors.brand} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </>
            )}

            <Modal
                visible={isMediaFullscreen}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMediaFullscreen}
            >
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 40, right: 20, zIndex: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }}
                        onPress={closeMediaFullscreen}
                    >
                        <MaterialIcons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={goPrevMedia}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: 20,
                            transform: [{ translateY: -24 }],
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20,
                        }}
                    >
                        <MaterialIcons name="chevron-left" size={32} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={goNextMedia}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: 20,
                            transform: [{ translateY: -24 }],
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20,
                        }}
                    >
                        <MaterialIcons name="chevron-right" size={32} color="#fff" />
                    </TouchableOpacity>
                    {galleryItems[selectedMediaIndex]?.type === 'image' ? (
                        <Image
                            source={{ uri: galleryItems[selectedMediaIndex].url }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="contain"
                        />
                    ) : (
                        <View style={{ flex: 1, backgroundColor: '#000' }}>
                            {Platform.OS === 'web' ? (
                                <video
                                    ref={(ref) => { fullscreenVideoRef.current = ref; }}
                                    src={galleryItems[selectedMediaIndex]?.url}
                                    style={{ width: '100%', height: '100%', objectFit: isPortraitVideo ? 'contain' : 'cover', backgroundColor: '#000' }}
                                    muted={isMuted}
                                    controls={false}
                                    autoPlay={fullscreenAutoPlay}
                                    onLoadedMetadata={handleWebVideoLoad}
                                    onPlay={() => setIsVideoPlayingState(true)}
                                    onPause={() => setIsVideoPlayingState(false)}
                                />
                            ) : (
                                <Video
                                    ref={fullscreenVideoRef}
                                    source={{ uri: galleryItems[selectedMediaIndex]?.url }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode={ResizeMode.CONTAIN}
                                    useNativeControls={false}
                                    shouldPlay={fullscreenAutoPlay}
                                    isMuted={isMuted}
                                    onPlaybackStatusUpdate={handleVideoStatusUpdate}
                                />
                            )}
                            <TouchableOpacity
                                onPress={toggleVideoPlayback}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: [{ translateX: -26 }, { translateY: -26 }],
                                    width: 52,
                                    height: 52,
                                    borderRadius: 26,
                                    backgroundColor: 'rgba(0,0,0,0.65)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                }}
                            >
                                <MaterialIcons name={isVideoPlayingState ? 'pause' : 'play-arrow'} size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </>
    );
};

// Default export for this module.
export default MediaViewer;
