// File: src/services/seller.service.ts
// Module responsible for backend functionality.

// src/services/sellerService.ts
import prisma from '@/utils/prisma.js';
import { encryptText, decryptText } from '@/utils/encryption.js';

export const decryptSellerApplication = (app: any) => {
    if (!app) return app;

    return {
        ...app,
        reason: app.reason ? decryptText(app.reason) : undefined,
        adminNotes: app.adminNotes ? decryptText(app.adminNotes) : undefined,
        farmLocationLat: app.farmLocationLat ? parseFloat(decryptText(app.farmLocationLat)) : undefined,
        farmLocationLng: app.farmLocationLng ? parseFloat(decryptText(app.farmLocationLng)) : undefined,
        farmLocationAddress: app.farmLocationAddress ? decryptText(app.farmLocationAddress) : undefined
    };
};

// Service that manages seller operations.
export const sellerService = {
    async getActiveApplication(userId: string) {
        return prisma.sellerApplication.findFirst({
            where: {
                userId,
                status: {
                    in: ['pending', 'blocked_from_applying']
                }
            },
            select: {
                id: true,
                status: true
            }
        });
    },

    async createApplication(userId: string, reason: string | undefined, filesData: any[], farmLocationLat?: number, farmLocationLng?: number, farmLocationAddress?: string) {
        const app = await prisma.sellerApplication.create({
            data: {
                userId,
                reason: reason ? encryptText(reason) : undefined,
                status: 'pending',
                attachments: {
                    create: filesData.map(file => ({
                        type: file.type,
                        url: file.url,
                        filename: file.filename,
                        mimeType: file.mimeType,
                        uploaderId: userId
                    }))
                },
                farmLocationLat: farmLocationLat !== undefined ? encryptText(String(farmLocationLat)) : undefined,
                farmLocationLng: farmLocationLng !== undefined ? encryptText(String(farmLocationLng)) : undefined,
                farmLocationAddress: farmLocationAddress ? encryptText(farmLocationAddress) : undefined
            },
            include: {
                attachments: true
            }
        });

        return app;
    },

    async getMyApplication(userId: string) {
        const app = await prisma.sellerApplication.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                attachments: true
            }
        });

        return decryptSellerApplication(app);
    },

    async getAllApplications() {
        const apps = await prisma.sellerApplication.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                attachments: true
            }
        });

        return apps.map(decryptSellerApplication);
    },

    async getApplicationById(id: string) {
        return prisma.sellerApplication.findUnique({
            where: { id },
            select: { userId: true }
        });
    },

    async updateApplicationStatus(id: string, status: 'approved' | 'rejected' | 'blocked_from_applying', notes: string) {
        return prisma.sellerApplication.update({
            where: { id },
            data: {
                status,
                adminNotes: notes ? encryptText(notes) : undefined,
                reviewedAt: new Date()
            }
        });
    },

    async updateUserRole(userId: string, role: 'seller' | 'admin' | 'buyer') {
        return prisma.user.update({
            where: { id: userId },
            data: { role }
        });
    }
};