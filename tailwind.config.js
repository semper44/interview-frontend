/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./**/*.js"],
  theme: {
    screens:{
        'xs': '480px', // Custom screen size smaller than sm
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
    extend: {
      colors: {
        base: {
          darkbg: '#0D131A',
          darkbgvariant: '#1D2833',
        },
      },
  },
  plugins: [],
}
}

