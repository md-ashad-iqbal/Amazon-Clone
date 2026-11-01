/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0F1A2A',
          800: '#172538',
          700: '#22344D',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 26, 42, 0.06), 0 4px 12px rgba(15, 26, 42, 0.06)',
        lift: '0 8px 24px rgba(15, 26, 42, 0.14)',
      },
    },
  },
  plugins: [],
};
