import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f8",
          100: "#ffedf0",
          200: "#ffd9e0",
          300: "#ffbecb",
          400: "#ff9fb2",
          500: "#f9799a",
          600: "#e8577f",
          700: "#c93f66",
          800: "#a63357",
          900: "#7f2843",
        },
        cream: {
          50: "#fffdf9",
          100: "#fdf6ec",
          200: "#f9ecd8",
        },
        gold: {
          300: "#f0d99a",
          400: "#e2bd6c",
          500: "#cf9f43",
          600: "#a97e2f",
        },
        rose: {
          400: "#e26b8a",
          500: "#c94f70",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(4deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        sparkle: "sparkle 2.4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
