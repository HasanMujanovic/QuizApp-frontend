/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#10454F",
        customGrayBlue: "#506266",
        customBetween: "#818274",
        customLessYellow: "#C6DF66",
        customYellow: "#BDE038",
      },
    },
  },
  plugins: [],
};
