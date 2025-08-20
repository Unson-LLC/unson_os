/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Phase colors
        research: '#3B82F6',
        lp: '#10B981',
        mvp: '#F59E0B',
        monetization: '#8B5CF6',
        scale: '#6366F1',
        // Status colors
        healthy: '#10B981',
        warning: '#F59E0B',
        critical: '#EF4444',
      },
    },
  },
  plugins: [],
}