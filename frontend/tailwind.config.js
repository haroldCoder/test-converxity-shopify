/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shopify: {
          green: '#008060',
          'green-dark': '#004c3f',
          surface: '#f6f6f7',
          border: '#e1e3e5',
        },
      },
    },
  },
  plugins: [],
}
