/**
 * Light Mode Theme for GeoAttend
 * Professional, clean design with accessibility focus
 */

import { Platform } from 'react-native';

// Primary brand colors (light mode only)
const tintColorLight = '#1e88e5'; // Professional blue
const accentColor = '#43a047'; // Success green
const errorColor = '#e53935'; // Error red
const warningColor = '#fb8c00'; // Warning orange

export const Colors = {
  light: {
    // Text colors
    text: '#1a1a1a',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Background colors
    background: '#ffffff',
    surfaceLight: '#f5f7fa',
    surfaceDark: '#ecf0f5',
    
    // Brand colors
    tint: tintColorLight,
    icon: '#424242',
    
    // Tab colors
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    
    // Status colors
    success: accentColor,
    error: errorColor,
    warning: warningColor,
    info: tintColorLight,
    
    // Border colors
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
  },
  dark: {
    // Disabled for light mode only
    text: '#ffffff',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#ffffff',
    tabIconDefault: '#ffffff',
    tabIconSelected: tintColorLight,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
