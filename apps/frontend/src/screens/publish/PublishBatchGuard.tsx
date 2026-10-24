// File: frontend/src/screens/publish/PublishBatchGuard.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { useRoleGuard } from '@/hooks/auth/use-role-guard';
import PublishBatchScreen from '@/screens/publish/PublishBatchScreen';

// Default React component export.
export default function PublishBatchGuard() {
    useRoleGuard(['seller'], '/');
    return <PublishBatchScreen />;
}
