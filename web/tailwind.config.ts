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
        primary: "var(--foreground-rgb)",
        background: "var(--background-rgb)",
        accent: "var(--accent-rgb)",
        inputbg: "var(--inputbg-rgb)",
        cardbg: "var(--cardbg-rgb)",
      },
    },
  },
  plugins: [],
};
export default config;
