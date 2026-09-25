/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your files are in different folders
  ],
  theme: {
    extend: {
      // Custom breakpoints for better mobile control
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      // Netflix-inspired colors
      colors: {
        "netflix-red": "#e50914",
        "netflix-black": "#141414",
        "netflix-gray": "#2f2f2f",
        "netflix-light-gray": "#b3b3b3",
      },
      // Custom spacing for mobile
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      // Custom animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
