export const COLORS = {
    primary: '#0f172a',    // Dark Navy for heavy elements
    secondary: '#0055ff',  // Vivid Blue for actions (replaces neon teal)
    accent: '#f59e0b',     // Amber for highlights
    bg: '#ffffff',         // White background
    bgCard: '#f1f5f9',     // Light Slate for cards (subtle separation)
    text: '#1e293b',       // Slate 800 for main text
    textMuted: '#64748b',  // Slate 500 for secondary text
    success: '#10b981',    // Emerald Green
    error: '#ef4444',      // Red
    warning: '#f59e0b',    // Amber
};

export const FONTS = {
    sans: 'System', // Will update to Outfit/Inter once fonts are loaded
};

export const SIZES = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
};

export const RADIUS = {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    neon: {
        shadowColor: '#64ffda',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
};

export const THEME = {
    COLORS,
    FONTS,
    SIZES,
    SPACING,
    RADIUS,
    SHADOWS,
};
