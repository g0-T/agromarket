// File: src/utils/socket.ts
// WebSocket helpers and server initialization.

import { Server as HttpServer } from 'http';
import { Server as IOServer, ServerOptions } from 'socket.io';
import { auth } from '@/auth.js';
import logger from '@/logger/index.js';

let io: IOServer | null = null;

export const initSocketServer = (httpServer: HttpServer, options: Partial<ServerOptions>) => {
    if (io) return io;

    io = new IOServer(httpServer, options as ServerOptions);

    io.use(async (socket, next) => {
        try {
            const explicitAuth = socket.handshake.auth || {};
            const explicitToken = explicitAuth.token || explicitAuth.Authorization || explicitAuth.authorization;
            const headerToken = socket.handshake.headers?.authorization;
            const token = explicitToken || headerToken;

            logger.info('[SOCKET AUTH] handshake auth', {
                auth: explicitAuth,
                headerAuthorization: headerToken,
                cookie: Boolean(socket.handshake.headers?.cookie),
                betterAuthId: socket.handshake.headers?.['x-better-auth-id'],
                sessionToken: socket.handshake.headers?.['x-better-auth-session-token'],
            });

            if (!token) {
                return next(new Error('No autorizado - Missing explicit token'));
            }

            const authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            const sessionHeaders: Record<string, string> = {
                authorization,
            };

            if (typeof socket.handshake.headers?.cookie === 'string') {
                sessionHeaders.cookie = socket.handshake.headers.cookie;
            }
            if (typeof socket.handshake.headers?.['x-better-auth-id'] === 'string') {
                sessionHeaders['x-better-auth-id'] = socket.handshake.headers['x-better-auth-id'];
            }
            if (typeof socket.handshake.headers?.['x-better-auth-session-token'] === 'string') {
                sessionHeaders['x-better-auth-session-token'] = socket.handshake.headers['x-better-auth-session-token'];
            }

            const session = await auth.api.getSession({
                headers: sessionHeaders,
            });

            if (!session || !session.user) {
                logger.warn('[SOCKET AUTH] session invalid', { authorization: Boolean(authorization) });
                return next(new Error('No autorizado'));
            }

            socket.data.user = session.user;
            return next();
        } catch (error) {
            logger.error('[SOCKET AUTH] Failed to validate session', error);
            return next(new Error('No autorizado'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.user?.id;
        logger.info(`[SOCKET] connected user=${userId}`);

        // Auto-join a per-user room so server can emit per-user events without
        // requiring the client to join many transaction rooms.
        if (userId) {
            const userRoom = `user:${userId}`;
            socket.join(userRoom);
            logger.info(`[SOCKET] user=${userId} auto-joined ${userRoom}`);
        }

        socket.on('joinTransaction', (transactionId: string) => {
            if (typeof transactionId === 'string' && transactionId.trim()) {
                socket.join(`transaction:${transactionId}`);
                logger.info(`[SOCKET] user=${userId} joined transaction:${transactionId}`);
            }
        });

        socket.on('leaveTransaction', (transactionId: string) => {
            if (typeof transactionId === 'string' && transactionId.trim()) {
                socket.leave(`transaction:${transactionId}`);
                logger.info(`[SOCKET] user=${userId} left transaction:${transactionId}`);
            }
        });

        socket.on('disconnect', () => {
            logger.info(`[SOCKET] disconnected user=${userId}`);
        });
    });

    return io;
};

export const getSocketServer = () => io;
