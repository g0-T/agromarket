// File: frontend/src/constants/theme.ts
// Application constants and static values.

// Exported constant Colors.
export const Colors = {
    primaryLight: '#2c5926',
    primaryDark: '#256b1f',
    primaryAlpha: '#2c592633',
    primaryGhost: '#2c592611',
    bgDark: '#161d15',
    bgLight: '#f6f7f6',
    surfaceDark: '#1e261d',
    surfaceLight: '#ffffff',
    textInDarkMode: '#ffffff',
    textInLightMode: '#1b3a18',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    borderDark: '#2c592644',
    borderLight: '#e2e8f0',
};

// Exported constant getThemeColors.
export const getThemeColors = (isDark: boolean) => ({
    brand: isDark ? Colors.primaryDark : Colors.primaryLight,
    backgroundColor: isDark ? Colors.bgDark : Colors.bgLight,
    cardColor: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    textColor: isDark ? Colors.textInDarkMode : Colors.textInLightMode,
    textInDarkMode: Colors.textInDarkMode, 
    borderColor: isDark ? Colors.borderDark : Colors.borderLight,
    verificationBoxBackground: isDark ? Colors.primaryAlpha : Colors.primaryGhost,
    placeholderColor: isDark ? Colors.textDim : Colors.textMuted,
    mutedText: isDark ? Colors.textMuted : Colors.textDim,
    input: isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
    accent: Colors.primaryAlpha,
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
});