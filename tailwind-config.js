/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#ff5311',
        'brand-black': '#000000',
        'brand-white': '#ffffff',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 4px 6px rgba(255, 83, 17, 0.1)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
