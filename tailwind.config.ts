import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coal: "#0a0a0a",
        ink: "#121212",
        redflag: "#C8102E",
        oxblood: "#B71C1C",
        cream: "#E8E6E3",
        poster: "#D6A84F"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,16,46,.35), 0 18px 60px rgba(0,0,0,.45)"
      }
    }
  },
  plugins: []
};

export default config;
