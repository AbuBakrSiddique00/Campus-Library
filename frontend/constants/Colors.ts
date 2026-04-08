const tintColorLight = '#7C3AED';
const tintColorDark = '#A78BFA';

export default {
  light: {
    primary: '#7C3AED',       // Vibrant Purple
    primaryLight: '#D946EF',  // Bright Fuchsia (Creates a stunning gradient)
    secondary: '#14B8A6',     // Electric Teal for beautiful contrast
    background: '#FAFAF9',    // Warm off-white
    surface: '#FFFFFF',       // Clean white for cards
    text: '#1C1917',          // Deepest warm gray
    textSecondary: '#78716C', // Soft gray for subtext
    border: '#E7E5E4',        // Subtle borders
    error: '#EF4444',         // Crisp Red
    success: '#10B981',       // Mint Green
    tint: tintColorLight,
    tabIconDefault: '#A8A29E',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#8B5CF6',       // Brighter violet for dark mode
    primaryLight: '#E879F9',  // Softer Fuchsia
    secondary: '#2DD4BF',     // Bright Teal
    background: '#1C1917',    // Deep stone background
    surface: '#292524',       // Elevated dark surface
    text: '#F5F5F4',          // Off-white text
    textSecondary: '#A8A29E', // Dimmed text
    border: '#44403C',        // Subtle dark borders
    error: '#F87171',
    success: '#34D399',
    tint: tintColorDark,
    tabIconDefault: '#78716C',
    tabIconSelected: tintColorDark,
  },
};
