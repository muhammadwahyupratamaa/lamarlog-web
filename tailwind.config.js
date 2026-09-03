/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        mist: '#f4f6f8',
        line: '#d9e0e7',
        signal: '#0e7490',
      },
    },
  },
  plugins: [],
};
