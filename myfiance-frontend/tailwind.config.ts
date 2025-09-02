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
        'primary': '#084C61',
        'accent-green': '#177E89',
        'accent-red': '#DB3A34',
        'dark': '#323031',
      },
    },
  },
  plugins: [],
};
export default config;