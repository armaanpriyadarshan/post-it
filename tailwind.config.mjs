/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Adjust paths to match your project structure
    ],
    theme: {
      extend: {
        colors: {
          // custom colors
          cream: '#f5ecde',
          darkGreen: '#2d6a52',
          lightGreen: '#bbd378',
          cafeBrown: '#4c380b'
        },
      },
    },
    plugins: [],
  };