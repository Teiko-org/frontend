/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#103464',
        darkBlue: '#30344F',
        gold: '#A47032',
        darkGold: '#D4B076',
        goldCard: '#BF9328',
        white: '#FFFFFF',
        bgHome: '#FFE7DD',
        bgNativeHome: '#FFEEE7',
        pink: '#FECCCD',
        pinkCard: '#FCDEDF',
        darkPinkCard: '#F0C0B5',
        black: '#000000',
        goldButton: '#FFE8C4',
        darkGoldButton: '#CD8126',
        graySoldOut: '#656565',
        blueMedium: '#3A4868',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(to top, #30344F 0%, #103464 100%)',
      },  
    },
  },
  plugins: [],
}