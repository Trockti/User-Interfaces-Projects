/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      flex: {
        '2': '2',
      },
      outline: {
        red: '2px solid red',
      },
      spacing: {
        '1': '1px',
      },
      colors: {
        whitesmoke: '#f5f5f5',
        lightgrey: '#d3d3d3',
        lightblue: '#add8e6',
      },
    },
  },
  plugins: [],
}

