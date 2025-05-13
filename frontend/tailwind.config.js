/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      opacity: {
        50: "0.5",
        100: "1",
      },
      colors: {
        primary: "#101624",
        stats: "#1E1E29",
        option: "#111827",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        light: {
          primary: "#4F46E5", // primary action color (buttons, icons, highlights)
          secondary: "#d6ddff", // secondary accent (backgrounds, badges)
          background: "#f1f3fc", // overall app background
          card: "#ffffff", // card backgrounds
          darkText: "#111827", // heading text
          lightText: "#6B7280", // subtext
          border: "#f3f4f6", // subtle dividers
        },
        card: "#1A233A",
        correct: "rgba(34, 197, 94, 0.3)",
        border1:
          "linear-gradient(45deg, rgba(0, 255, 255, 0.7), rgba(0, 255, 255, 0.2))", // Custom aqua gradient
        wrong: "rgba(239, 68, 68, 0.3)",
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-semiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  darkMode: "class", // Enable dark mode by class
  plugins: [],
};
