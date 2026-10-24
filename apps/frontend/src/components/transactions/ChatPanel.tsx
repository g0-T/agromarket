// File: frontend/src/components/transactions/ChatPanel.tsx
// Panel component for chat panel.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '@/hooks/use-auth';
import transactionService from '@/services/transaction.service';
import { mapApiMessage, ChatMessage } from '@/utils/transaction-helpers';
import { useChatSocket } from '@/hooks/use-chat-socket';
import logger from '@/utils/logger';
import notificationEventsService from '@/services/notification-events.service';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration ChatPanelProps.
export type ChatPanelProps = {
    transactionId: string;
    counterpart?: string;
    styles: any;
    colors: any;
};

// Component for chat panel.
const ChatPanel = ({ transactionId, counterpart, styles, colors }: ChatPanelProps) => {
    const { user } = useAuth();
    const name = counterpart || 'Usuario';
    const [input, setInput] = useState('');
    const [transaction, setTransaction] = useState<any>(null);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const { messages, setInitialMessages, replaceMessage } = useChatSocket(transactionId, user?.id);

    const loadMessages = useCallback(async () => {
        try {
            const tx = await transactionService.getTransaction(transactionId);
            setTransaction(tx);
            const msgs = Array.isArray(tx.chatMessages)
                ? tx.chatMessages.map((m: any) => mapApiMessage(m, user?.id))
                : [];
            setInitialMessages(msgs);
        } catch (err: any) {
            logger.warn('failed to load chat messages', { error: err });
        }
    }, [transactionId, user?.id, setInitialMessages]);

    useEffect(() => {
        if (!transactionId) return;
        loadMessages();
    }, [transactionId, loadMessages]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const sendMessage = useCallback(async (attachment?: any) => {
        if (!input.trim() && !attachment) return;
        const textToSend = input.trim() || undefined;
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const optimisticMessage: ChatMessage = {
            id: tempId,
            text: textToSend,
            fromMe: true,
            time: new Date().toLocaleTimeString(),
            transactionId,
            senderId: user?.id || '',
            attachment: attachment?.uri,
            createdAt: new Date().toISOString(),
        };

        replaceMessage(tempId, optimisticMessage);
        setInput('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);

        try {
            const msg = await transactionService.sendChatMessage(transactionId, textToSend, attachment);
            replaceMessage(tempId, mapApiMessage(msg, user?.id));
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);

            // Send notification to the other party
            if (transaction && user?.id) {
                const receiverId = transaction.buyerId === user.id ? transaction.sellerId : transaction.buyerId;
                if (receiverId && textToSend) {
                    await notificationEventsService.notifyNewMessage(
                        transactionId,
                        user.id,
                        receiverId,
                        textToSend
                    );
                }
            }
        } catch (err) {
            replaceMessage(tempId, {
                ...optimisticMessage,
                text: 'Mensaje fallido. Intenta de nuevo.',
            });
            Alert.alert('Error', 'No se pudo enviar el mensaje');
        }
    }, [input, transactionId, user?.id, transaction, replaceMessage]);

    const pickAndSend = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const file = {
                    uri: asset.uri,
                    name: asset.name,
                    type: asset.mimeType || 'application/octet-stream',
                } as any;
                await sendMessage(file);
            }
        } catch (err) {
            logger.warn('attachment error', { error: err });
        }
    };

    const openAttachment = async (url?: string) => {
        if (!url) return;
        try {
            await Linking.openURL(url);
        } catch {
            Alert.alert('Error', 'No se pudo abrir el adjunto');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.chatHeader}>
                <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>{name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.chatCounterpart} numberOfLines={1}>{name}</Text>
                    <View style={styles.chatOnlineRow}>
                        <View style={styles.chatOnlineDot} />
                        <Text style={styles.chatOnlineText}>Activo ahora</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.chatMessages}
                contentContainerStyle={{ padding: 12, paddingBottom: 4 }}
                showsVerticalScrollIndicator={false}
            >
                {messages.map(msg => (
                    <View
                        key={msg.id}
                        style={[
                            styles.chatBubbleWrapper,
                            msg.fromMe ? styles.chatBubbleWrapperMe : styles.chatBubbleWrapperThem,
                        ]}
                    >
                        <View style={[styles.chatBubble, msg.fromMe ? styles.chatBubbleMe : styles.chatBubbleThem]}>
                            {msg.text ? (
                                <Text style={[styles.chatBubbleText, msg.fromMe && styles.chatBubbleTextMe]}>
                                    {msg.text}
                                </Text>
                            ) : null}
                            {msg.attachment && (
                                <TouchableOpacity onPress={() => openAttachment(msg.attachment)}>
                                    <Text style={[styles.chatBubbleText, { textDecorationLine: 'underline', color: colors.brand }]}>Adjunto</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.chatTime}>{msg.time}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.chatInputRow, { paddingHorizontal: 8 }]}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Escribe un mensaje..."
                    multiline={false}
                    style={{
                        flex: 1,
                        height: 45,
                        paddingHorizontal: 15,
                        borderRadius: 22.5,
                        backgroundColor: colors.cardColor,
                        color: colors.textColor,
                        fontSize: 15,
                    }}
                    placeholderTextColor={colors.mutedText}
                />
                <TouchableOpacity
                    style={styles.chatSendBtn}
                    onPress={() => sendMessage()}
                    activeOpacity={0.8}
                    disabled={!input.trim()}
                >
                    <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

// Default export for this module.
export default ChatPanel;
