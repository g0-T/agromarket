// File: frontend/src/types/market.ts
// Type definitions for frontend data models.

// Type declaration MarketItem.
export interface MarketItem {
    id: number;
    title: string;
    breed: string;
    type: string;
    category: string;
    weight: string;
    location: string;
    price: number;
    currency: string;
    heads: number;
    age: string;
    condition: string;
    verified: boolean;
    img: string;
    attachments?: Array<{ id: string; url: string; filename?: string; mimeType?: string }>;
}