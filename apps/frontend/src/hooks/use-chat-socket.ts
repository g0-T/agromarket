// File: frontend/src/hooks/use-chat-socket.ts
// Custom hook for real-time transaction chat using Socket.IO and local notifications.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';
import authService from '@/services/auth.service';
import notificationService from '@/services/notification.service';
import { mapApiMessage, ChatMessage } from '@/utils/transaction-helpers';
import logger from '@/utils/logger';
import { getApiBaseUrl, getSocketUrl } from '@/utils/api-config';

const API_BASE = getApiBaseUrl();
const SOCKET_URL = getSocketUrl();

export const useChatSocket = (transactionId?: string | null, myId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const socketRef = useRef<Socket | null>(null);

    const showForegroundNotification = useCallback(async (message: ChatMessage) => {
        if (Platform.OS === 'web') return;
        if (appState.current !== 'active') return;

        try {
            await notificationService.scheduleLocalNotification(
                `Nuevo mensaje de ${message.sender?.name || 'usuario'}`,
                message.text ? message.text.slice(0, 120) : 'Tienes un nuevo mensaje en la transacción.',
                {
                    type: 'message',
                    transactionId: message.transactionId,
                    senderId: message.senderId,
                }
            );
        } catch (notificationError) {
            logger.warn('[useChatSocket] Local notification failed', { error: notificationError });
        }
    }, []);

    const handleNewMessage = useCallback(
        async (message: ChatMessage) => {
            setMessages((current) => {
                const exists = current.some((item) => item.id === message.id);
                if (exists) return current;
                return [...current, message].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
            });
            await showForegroundNotification(message);
        },
        [showForegroundNotification]
    );

    const sendJoinRoom = useCallback((socket: Socket, txId: string) => {
        socket.emit('joinTransaction', txId);
    }, []);

    const sendLeaveRoom = useCallback((socket: Socket, txId: string) => {
        socket.emit('leaveTransaction', txId);
    }, []);

    const handleSocketMessage = useCallback(
        (message: any) => handleNewMessage(mapApiMessage(message, myId)),
        [handleNewMessage, myId]
    );

    const connectSocket = useCallback((txId: string) => {
        if (socketRef.current) {
            try {
                socketRef.current.disconnect();
            } catch {
                // ignore
            }
        }

        const token = authService.getToken();
        if (!token) {
            setError('No auth token available for chat socket');
            return null;
        }

        logger.info('[useChatSocket] Connecting socket', { socketUrl: SOCKET_URL, transactionId: txId, tokenPresent: !!token });

        const socket = io(SOCKET_URL, {
            transports: ['polling', 'websocket'],
            forceNew: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            withCredentials: false,
            auth: { token },
            path: '/socket.io',
            timeout: 20000,
        });

        socketRef.current = socket;

        socket.on('disconnect', (reason: any) => {
            logger.info('[useChatSocket] disconnected', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (connectError: any) => {
            logger.warn('[useChatSocket] socket connect_error', connectError);
            setError(typeof connectError === 'string' ? connectError : connectError?.message || 'Socket connect error');
        });

        socket.on('reconnect_attempt', (attempt: number) => {
            logger.info(`[useChatSocket] reconnect attempt ${attempt}`);
        });

        socket.on('reconnect_failed', () => {
            logger.warn('[useChatSocket] reconnect failed');
        });

        socket.on('connect', () => {
            setIsConnected(true);
            setError(null);
            logger.info('[useChatSocket] connected', { socketId: socket.id });
            sendJoinRoom(socket, txId);
        });

        socket.on('chatMessage', handleSocketMessage);
        socket.on('error', (socketError: any) => {
            setError(typeof socketError === 'string' ? socketError : socketError?.message || 'Socket error');
        });

        return socket;
    }, [handleSocketMessage, sendJoinRoom]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (!transactionId || !myId) return;

        const token = authService.getToken();
        if (!token) {
            setError('No auth token available for chat socket');
            return;
        }

        const socket = connectSocket(transactionId);
        if (!socket) return;

        return () => {
            if (socket && transactionId) {
                sendLeaveRoom(socket, transactionId);
            }
            if (socket) {
                socket.off('chatMessage', handleSocketMessage);
                socket.off('connect_error');
                socket.off('error');
                socket.off('connect');
                socket.off('disconnect');
                socket.disconnect();
            }
            socketRef.current = null;
        };
    }, [transactionId, connectSocket, handleSocketMessage, sendLeaveRoom, myId]);

    const resetMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const setInitialMessages = useCallback((initialMessages: ChatMessage[]) => {
        setMessages(() =>
            [...initialMessages].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
        );
    }, []);

    const addMessage = useCallback((message: ChatMessage) => {
        setMessages((current) => {
            const exists = current.some((item) => item.id === message.id);
            if (exists) return current;
            return [...current, message].sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        });
    }, []);

    const replaceMessage = useCallback((tempId: string, message: ChatMessage) => {
        setMessages((current) => {
            const hasTemp = current.some((item) => item.id === tempId);
            const updated = hasTemp
                ? current.map((item) => (item.id === tempId ? message : item))
                : [...current, message];

            return updated
                .filter((item, index, self) => self.findIndex((other) => other.id === item.id) === index)
                .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        });
    }, []);

    return useMemo(
        () => ({
            messages,
            isConnected,
            error,
            resetMessages,
            setInitialMessages,
            addMessage,
            replaceMessage,
            socket: socketRef.current,
        }),
        [messages, isConnected, error, resetMessages, setInitialMessages, addMessage, replaceMessage]
    );
};
