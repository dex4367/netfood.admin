/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // green-600 
          hover: '#15803d', // green-700
          light: '#dcfce7', // green-100
          dark: '#166534', // green-800
        },
        secondary: '#334155', // slate-700
      },
    },
  },
  plugins: [],
}; 