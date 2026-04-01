/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        spotlight: "spotlight 2s ease-out forwards",
        "fade-in": "fadeIn 2s ease-out forwards",
        "border-pulse": "borderPulse 2s ease-in-out infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translateY(-50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        borderPulse: {
          "0%, 100%": {
            "border-color": "rgba(59, 130, 246, 0)",
            "box-shadow": "0 0 0 0 rgba(168, 85, 247, 0)",
          },
          "50%": {
            "border-color": "rgba(59, 130, 246, 0.2)",
            "box-shadow": "0 0 20px 5px rgba(168, 85, 247, 0.2)",
          },
        },
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
