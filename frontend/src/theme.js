import { extendTheme } from '@chakra-ui/react';

// 1. Define your color palette
const colors = {
  brand: {
    900: '#024662',
    800: '#04648c',
    700: '#0682b6',
    600: '#08a0e0',
    500: '#0abefb', // Our main brand color
    400: '#3bd0fc',
    300: '#6cdeff',
    200: '#9de9ff',
    100: '#cff4ff',
    50: '#e5f9ff',
  },
};

// 2. Define global font styles
const fonts = {
  heading: `'Poppins', sans-serif`,
  body: `'Roboto', sans-serif`,
};

// 3. Create the theme object
const theme = extendTheme({ colors, fonts });

export default theme;