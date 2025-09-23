const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

// export default {
//   light: {
//     text: '#000',
//     background: '#fff',
//     tint: tintColorLight,
//     tabIconDefault: '#ccc',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
    // text: '#fff',
    // background: '#000',
    // tint: tintColorDark,
    // tabIconDefault: '#ccc',
    // tabIconSelected: tintColorDark,
//   },
// };

export const Colors = {
  light: {
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#20B2AA',
    secondary: '#F8F9FA',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E5E5E5',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#20B2AA',
    secondary: '#2A2A2A',
    background: '#1A1A1A',
    card: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#333333',
    shadow: 'rgba(255, 255, 255, 0.1)'
  }
};

export const Gradients = {
  hero: ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent'],
  promo: ['#667eea', '#764ba2'],
  card: ['#f093fb', '#f5576c']
};