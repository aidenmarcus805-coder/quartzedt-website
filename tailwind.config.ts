import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Obsidian Palette
        obsidian: {
          DEFAULT: "#050504",
          base: "#0A0A09",
          surface: "#121211",
          elevated: "#1A1A18",
        },
        champagne: {
          DEFAULT: "#D4D4D8",
          soft: "rgba(212, 212, 216, 0.1)",
        },
        cream: "#FAF9F6",
        stone: {
          400: "#A8A29E",
          600: "#57534E",
        },
        // Legacy/Utility
        paper: "#ffffff",
        ink: "#0b0b0c",
        accent: "#ff3b30", // Keeping this if used elsewhere, but moving to champagne for pricing
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

