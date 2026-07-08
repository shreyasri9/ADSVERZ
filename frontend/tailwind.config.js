/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#4f75be',
        'logo-red': '#7e94b2',
        'bg-dark': '#0b0f19',
        'card-dark': '#111827',
        'text-slate': '#9ca3af',
        'border-slate': '#1f2937',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
