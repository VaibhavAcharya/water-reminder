import type { Config } from "tailwindcss";

export default {
  content: ["./{app,components}/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
