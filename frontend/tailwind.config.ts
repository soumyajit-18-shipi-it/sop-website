import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-surface": "#191c1e",
        "background": "#f7f9fb",
        "surface-container": "#eceef0",
        "on-surface-variant": "#44474e",
        "secondary-container": "#d0e1fb",
        "on-tertiary": "#ffffff",
        "primary": "#000a1e",
        "inverse-surface": "#2d3133",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",
        "surface-bright": "#f7f9fb",
        "surface": "#f7f9fb",
        "inverse-primary": "#aec7f6",
        "on-secondary-container": "#54647a",
        "error-container": "#ffdad6",
        "primary-container": "#002147",
        "on-background": "#191c1e",
        "on-secondary-fixed-variant": "#38485d",
        "primary-fixed": "#d6e3ff",
        "surface-variant": "#e0e3e5",
        "tertiary-container": "#002718",
        "surface-container-low": "#f2f4f6",
        "outline-variant": "#c4c6cf",
        "on-primary-fixed-variant": "#2d476f",
        "tertiary-fixed-dim": "#4edea3",
        "primary-fixed-dim": "#aec7f6",
        "surface-container-high": "#e6e8ea",
        "on-primary": "#ffffff",
        "on-primary-container": "#708ab5",
        "inverse-on-surface": "#eff1f3",
        "error": "#ba1a1a",
        "on-tertiary-container": "#009c6b",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#465f88",
        "surface-dim": "#d8dadc",
        "outline": "#74777f",
        "secondary": "#505f76",
        "surface-container-highest": "#e0e3e5",
        "on-secondary": "#ffffff",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#6ffbbe",
        "tertiary": "#000d06",
        "secondary-fixed": "#d3e4fe",
        "on-secondary-fixed": "#0b1c30",
        "on-primary-fixed": "#001b3d",
        "secondary-fixed-dim": "#b7c8e1",
        "on-error": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "sm": "0.125rem",
        "md": "0.375rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "base": "4px",
        "margin": "32px",
        "gutter": "24px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;
