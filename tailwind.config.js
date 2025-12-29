/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        skin: {
          bg: "var(--bg)",
          text: "var(--text)",
          muted: "var(--muted-text)",
          blue: "var(--text-blue)",
          green: "var(--text-green)",
        },
      },
    },
  },
  plugins: [],
};
