/**
 * MyTempHome Design System - Color Palette & Theme Tokens
 * Synchronized with Figma Project "MyTempHome" (Node: ColorPalette)
 * Supports Light, Dark, and System modes
 */

export const palette = {
  primary: {
    100: '#F1EFFD',
    200: '#CDC6F9',
    300: '#A799F4',
    400: '#836AEF',
    500: '#6234E5',
    600: '#3F1B9F',
    700: '#1F0A57',
    base: '#1F0A57',
  },
  secondary: {
    100: '#F1E9FE',
    200: '#D4B7FD',
    300: '#BB83FC',
    400: '#A642FA',
    500: '#8011C9',
    600: '#510782',
    700: '#270242',
    base: '#510782',
  },
  tertiary: {
    100: '#FCEDF0',
    200: '#F6C7D2',
    300: '#F090AA',
    400: '#EB4882',
    500: '#B32E5F',
    600: '#791C3E',
    700: '#440C20',
    base: '#B32E5F',
  },
  quaternary: {
    100: '#FDD3E2',
    200: '#FB98C1',
    300: '#F94BA2',
    400: '#CB1A7D',
    500: '#8E0F56',
    600: '#550532',
    700: '#290115',
    base: '#CB1A7D',
  },
  grey: {
    100: '#F1F0F1',
    200: '#CCCBCF',
    300: '#A6A4AB',
    400: '#817E88',
    500: '#5D5B65',
    600: '#3C3A41',
    700: '#1D1C20',
  },
} as const;

export const semanticColors = {
  light: {
    background: '#F1F0F1',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    border: '#CCCBCF',
    borderSubtle: '#E5E4E8',
    textPrimary: '#1D1C20',
    textSecondary: '#5D5B65',
    textMuted: '#817E88',
    brandPrimary: '#1F0A57',
    brandPrimaryContent: '#FFFFFF',
    brandSecondary: '#510782',
    brandTertiary: '#B32E5F',
    brandQuaternary: '#CB1A7D',
    accent: '#6234E5',
    tint: '#F1EFFD',
    cardShadow: 'rgba(29, 28, 32, 0.08)',
  },
  dark: {
    background: '#131118',
    surface: '#1D1C20',
    surfaceRaised: '#28252F',
    border: '#3C3A41',
    borderSubtle: '#2A2830',
    textPrimary: '#F1F0F1',
    textSecondary: '#CCCBCF',
    textMuted: '#A6A4AB',
    brandPrimary: '#A799F4',
    brandPrimaryContent: '#1F0A57',
    brandSecondary: '#D4B7FD',
    brandTertiary: '#F090AA',
    brandQuaternary: '#FB98C1',
    accent: '#836AEF',
    tint: '#231B3A',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export const Colors = {
  ...palette,
  light: semanticColors.light,
  dark: semanticColors.dark,
};

export type ColorTheme = typeof Colors;
export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

export default Colors;
