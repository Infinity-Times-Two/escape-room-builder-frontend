import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'DEFAULT': '2px 2px #000',
        'xl': '4px 4px #000',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"],
  },
  safelist: [
    'bg-yellow-50', 'bg-blue-50', 'bg-green-50', 'bg-red-50', 'bg-purple-50', 'bg-pink-50', 'bg-orange-50',
  ],
};
export default config;
