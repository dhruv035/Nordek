/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        buttonGradient: `linear-gradient(94deg, #3387D5 -5.94%, #7A06C9 115.34%)`,
      },
      fontFamily: {
        poppins: ['Poppins']
      },
    },
    colors: {
      textBlue: "#627EEA",
      background: "#040406",
      bgNav: "#0B0819",
      innerBg:"#1C1731",
      white:"#ffffff",
      lightPurple:"#6E56F8",
      textPurple:"#627EEA",
      borderPurple:"rgba(110, 86, 248, 0.25);",
      themePurple:"#181627"
    },
  },
  plugins: [],
};
