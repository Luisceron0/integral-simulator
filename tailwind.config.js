/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1f2937',
        foreground: '#f9fafb',
        muted: '#374151',
        'muted-foreground': '#9ca3af',
        ring: '#06b6d4',
      },
    },
  },
  plugins: [],
}
