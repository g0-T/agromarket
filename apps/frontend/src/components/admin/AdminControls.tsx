// File: frontend/src/components/admin/AdminControls.tsx
// Component for admin controls.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { InputField } from '@/components/ui/InputField';

// Type declaration AdminControlsProps.
interface AdminControlsProps {
    activeTab: 'applications' | 'transactions' | 'disputes' | null;
    setActiveTab: (tab: 'applications' | 'transactions' | 'disputes' | null) => void;
    searchText: string;
    setSearchText: (text: string) => void;
    filter: 'all' | 'pending' | 'approved' | 'rejected' | 'completed' | 'paid' | 'disputed' | 'open' | 'resolved' | 'closed';
    setFilter: (filter: 'all' | 'pending' | 'approved' | 'rejected' | 'completed' | 'paid' | 'disputed' | 'open' | 'resolved' | 'closed') => void;
    colors: any;
    styles: any;
}

// Component for admin controls.
const AdminControls: React.FC<AdminControlsProps> = ({
    activeTab, setActiveTab, searchText, setSearchText, filter, setFilter, colors, styles,
}) => {
    const filterOptions: Array<{ key: 'all' | 'pending' | 'approved' | 'rejected' | 'completed' | 'paid' | 'disputed' | 'open' | 'resolved' | 'closed'; label: string }> = activeTab === 'applications'
        ? [
            { key: 'all', label: 'Todas' },
            { key: 'pending', label: 'Pendientes' },
            { key: 'approved', label: 'Aprobadas' },
            { key: 'rejected', label: 'Rechazadas' },
        ]
        : activeTab === 'transactions'
            ? [
                { key: 'all', label: 'Todas' },
                { key: 'pending', label: 'Pendientes' },
                { key: 'paid', label: 'Pagadas' },
                { key: 'completed', label: 'Completadas' },
                { key: 'disputed', label: 'En Disputa' },
            ]
            : activeTab === 'disputes'
                ? [
                    { key: 'all', label: 'Todas' },
                    { key: 'open', label: 'Abiertas' },
                    { key: 'resolved', label: 'Resueltas' },
                    { key: 'closed', label: 'Cerradas' },
                ]
                : [];

    return (
        <View style={styles.controlsContainer}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'applications' && styles.activeTab]}
                    onPress={() => { setActiveTab('applications'); setSearchText(''); setFilter('all'); }}
                >
                    <Text style={[styles.tabText, activeTab === 'applications' && styles.activeTabText]}>Solicitudes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'transactions' && styles.activeTab]}
                    onPress={() => { setActiveTab('transactions'); setSearchText(''); setFilter('all'); }}
                >
                    <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transacciones</Text>
                </TouchableOpacity>

            </View>

            <InputField
                placeholder={
                    activeTab === 'applications'
                        ? 'Buscar por nombre...'
                        : 'Buscar por ID, comprador o vendedor...'
                }
                value={searchText}
                onChangeText={setSearchText}
            />

            <View style={styles.filterContainer}>
                {filterOptions.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        style={[styles.filterButton, filter === option.key && styles.activeFilter]}
                        onPress={() => setFilter(option.key)}
                    >
                        <Text style={[styles.filterText, filter === option.key && styles.activeFilterText]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// Default export for this module.
export default AdminControls;
