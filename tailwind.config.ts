import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f9fafb",
        card: {
          DEFAULT: "rgba(17, 24, 39, 0.7)",
          foreground: "#f9fafb",
          border: "rgba(255, 255, 255, 0.08)",
        },
        primary: {
          DEFAULT: "#10b981", // Emerald green
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0ea5e9", // Sky blue
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#8b5cf6", // Violet
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1f2937",
          foreground: "#9ca3af",
        },
        emerald: {
          500: "#10b981",
          400: "#34d399",
          600: "#059669",
        },
        sky: {
          500: "#0ea5e9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "spin-slow": "spin 20s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "glow-gradient": "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
