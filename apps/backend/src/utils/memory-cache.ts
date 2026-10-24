// File: src/utils/memory-cache.ts
// Lightweight in-memory cache with TTL support.

export type CachedValue<T> = {
    value: T;
    expiresAt: number;
};

export class MemoryCache {
    private readonly store = new Map<string, CachedValue<any>>();

    get<T>(key: string): T | undefined {
        const entry = this.store.get(key);
        if (!entry) return undefined;

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return undefined;
        }

        return entry.value as T;
    }

    set<T>(key: string, value: T, ttlMs: number) {
        const expiresAt = Date.now() + ttlMs;
        this.store.set(key, { value, expiresAt });
    }

    delete(key: string) {
        this.store.delete(key);
    }

    clearPrefix(prefix: string) {
        for (const key of [...this.store.keys()]) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }

    clearAll() {
        this.store.clear();
    }

    keys(): IterableIterator<string> {
        return this.store.keys();
    }
}
