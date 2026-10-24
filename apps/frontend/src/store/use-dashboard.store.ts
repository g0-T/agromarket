// File: frontend/src/store/use-dashboard.store.ts
// Client state management store.

import { create } from 'zustand';

// Type declaration DashboardView.
export type DashboardView = 'home' | 'personal_data' | 'settings' | 'favorites' | 'help' | 'become_seller';

interface DashboardStore {
    currentView: DashboardView;
    setView: (view: DashboardView) => void;
    reset: () => void;
}

// State store hook for useDashboard.
export const useDashboardStore = create<DashboardStore>((set) => ({
    currentView: 'home',
    setView: (view) => set({ currentView: view }),
    reset: () => set({ currentView: 'home' }),
}));
