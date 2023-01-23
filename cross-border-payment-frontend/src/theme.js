// 1. import `extendTheme` function
import { extendTheme, defineStyleConfig } from '@chakra-ui/react';

// 2. Add your color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    primary: {
      main: '#212121',
      50: '#f8f0f2',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#737373',
      600: '#595959',
      700: '#404040',
      800: '#262626',
      900: '#120b0d',
    },
    secondary: {
      main: '#357E84',
      50: '#e1fafc',
      100: '#c2e8eb',
      200: '#a2d6db',
      300: '#80c6cc',
      400: '#5eb6bc',
      500: '#459ca3',
      600: '#337a7f',
      700: '#22575b',
      800: '#0e3538',
      900: '#001316',
    },
  },
  components: {
    FormLabel: {
      baseStyle: {
        mt: '1em',
      },
    },
  },
};

// 3. extend the theme
const theme = extendTheme(config);

export default theme;
