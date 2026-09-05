import type { TextStyle } from 'react-native';

import { config } from '@/theme/_config';
import type { UnionConfiguration } from '@/theme/types/config';
import type { FontColors, FontSizes } from '@/theme/types/fonts';

export const generateFontColors = (configuration: UnionConfiguration) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.entries(configuration.fonts.colors).reduce<FontColors>(
    (accumulator, [key, value]) => {
      return Object.assign(accumulator, {
        [key]: {
          color: value,
        },
      });
    },
    {} as FontColors,
  );
};

export const generateFontSizes = () => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return config.fonts.sizes.reduce<FontSizes>((accumulator, size) => {
    return Object.assign(accumulator, {
      [`size_${size}`]: {
        fontSize: size,
      },
    });
  }, {} as FontSizes);
};

export const staticFontStyles = {
  alignCenter: { textAlign: 'center' },
  alignRight: { textAlign: 'right' },
  alignLeft: { textAlign: 'left' },

  capitalize: { textTransform: 'capitalize' },
  uppercase: { textTransform: 'uppercase' },

  // --- System Font Weights (100 - 900) ---
  weight_100: { fontWeight: '100' },
  weight_200: { fontWeight: '200' },
  weight_300: { fontWeight: '300' },
  weight_400: { fontWeight: '400' },
  weight_500: { fontWeight: '500' },
  weight_600: { fontWeight: '600' },
  weight_700: { fontWeight: '700' },
  weight_800: { fontWeight: '800' },
  weight_900: { fontWeight: '900' },
  
  // Mặc định
  bold: { fontWeight: 'bold' },
} as const satisfies Record<string, TextStyle>;
