/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'h4i-blue': '#0069CA',
        'h4i-blue-light': '#C2E0FB',
        'h4i-mint': '#80D2C8',
        'h4i-mint-light': '#CBF9F3',
        'h4i-black': '#333333',
        'h4i-gray': '#657788',
        'h4i-coral': '#F2594B',
      },
      fontFamily: {
        karla: ['Karla', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      screens: {
        'nav': '1000px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

