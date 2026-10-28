/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#b4b4bb',
          400: '#8e8e97',
          500: '#6b6b74',
          600: '#4a4a52',
          700: '#333339',
          800: '#222227',
          900: '#17171b',
          950: '#0c0c0f',
        },
        ember: {
          200: '#ffd7b0',
          300: '#ffb773',
          400: '#ff9440',
          500: '#f47a1f',
        },
      },
      fontFamily: {
        display: ['Bangers', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
