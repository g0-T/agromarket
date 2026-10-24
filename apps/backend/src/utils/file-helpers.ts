// File: src/utils/file-helpers.ts
// Module responsible for backend functionality.

// src/utils/fileHelpers.ts

// Exported function prefixUrl.
export const prefixUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    return path;
};

// Exported function sanitizeFileName.
export const sanitizeFileName = (name: string): string =>
    name.replace(/[^a-zA-Z0-9._-]/g, '_');