import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        brand: {
          50: "#f0f0ff",
          100: "#e2e1ff",
          200: "#cbc8ff",
          300: "#a9a3ff",
          400: "#8375ff",
          500: "#6147ff",
          600: "#5227ff",
          700: "#4318eb",
          800: "#3714c4",
          900: "#2f129f",
          950: "#1c0a6b",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter var", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-ring": "pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "waveform": "waveform 1.2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(97, 71, 255, 0.7)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(97, 71, 255, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(97, 71, 255, 0)" },
        },
        waveform: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6147ff 0%, #a78bfa 100%)",
        "gradient-dark": "linear-gradient(180deg, #0f0f1a 0%, #0a0a12 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
