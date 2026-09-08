import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Baseline dimensions based on Figma design provided by the user
const guidelineBaseWidth = 428;
const guidelineBaseHeight = 805;

/**
 * horizontalScale (hs): Use for Width, MarginLeft/Right, PaddingHorizontal.
 */
export const hs = (size: number) => (width / guidelineBaseWidth) * size;

/**
 * verticalScale (vs): Use for Height, MarginTop/Bottom, PaddingVertical.
 */
export const vs = (size: number) => (height / guidelineBaseHeight) * size;

/**
 * moderateScale (ms): Use for FontSize, IconSize, BorderRadius.
 * It scales but applies a factor to prevent sizes from getting too ridiculously large on tablets.
 */
export const ms = (size: number, factor = 0.5) => size + (hs(size) - size) * factor;
