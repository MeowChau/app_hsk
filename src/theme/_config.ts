import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import type { ThemeConfiguration } from '@/theme/types/config';

export const enum Variant {
  DARK = 'dark',
}

const colorsLight = {
  // --- Màu mới thêm ---
  primary: '#0E84F2',
  primaryLight: '#33C9FC',
  secondary: '#F5F5F5',
  text: '#6E6E70',
  accentGreen: '#BDF2D0',
  accentCyan: '#33C9FC',
  accentPink: '#FFDAE9',
  accentLightCyan: '#C5F1EF',
  accentLightBlue: '#DFF3FF',

  // --- Màu mặc định của Boilerplate (giữ lại để tránh lỗi) ---
  gray100: '#DFDFDF',
  gray200: '#A1A1A1',
  gray400: '#4D4D4D',
  gray50: '#EFEFEF',
  gray800: '#303030',
  purple100: '#E1E1EF',
  purple50: '#1B1A23',
  purple500: '#44427D',
  red500: '#C13333',
  skeleton: '#A1A1A1',
} as const;

const colorsDark = {
  // --- Màu mới thêm (Dark mode) ---
  primary: '#0E84F2',
  primaryLight: '#33C9FC',
  secondary: '#1A1A1A', // Dark version của F5F5F5
  text: '#FFFFFF', // Dark version của 6E6E70
  accentGreen: '#BDF2D0',
  accentCyan: '#33C9FC',
  accentPink: '#FFDAE9',
  accentLightCyan: '#C5F1EF',
  accentLightBlue: '#DFF3FF', // Dark version của DFF3FF (bạn có thể thay đổi sau nếu muốn thẻ có màu khác ở chế độ tối)

  // --- Màu mặc định của Boilerplate (giữ lại để tránh lỗi) ---
  gray100: '#000000',
  gray200: '#BABABA',
  gray400: '#969696',
  gray50: '#EFEFEF',
  gray800: '#E0E0E0',
  purple100: '#252732',
  purple50: '#1B1A23',
  purple500: '#A6A4F0',
  red500: '#C13333',
  skeleton: '#303030',
} as const;

const sizes = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80] as const;

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 16],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
