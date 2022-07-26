module.exports = {
  content: ["./**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        initcell: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        hovercell: {
          "0%": { transform: "scale(1.0)" },
          "20%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1.0)" },
        },
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, -1px, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 2px, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, -4px, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 4px, 0)",
          },
        },
        scale: {
          "0%": {
            transform: "scale(1.0)",
          },
          "50%": {
            transform: "scale(1.2)",
          },
          "70%": {
            transform: "scale(1.0)",
          },
          "90%": {
            transform: "scale(1.7)",
          },
          "100%": {
            transform: "scale(1.0)",
          },
        },
      },
      animation: {
        initcell: "initcell 0.25s ease",
        hovercell: "hovercell 1s ease",
        "pulse-2": "pulse 0.5s ease 2",
        shake: "shake .3s cubic-bezier(.36,.07,.19,.97) both",
        scale: "scale 1s cubic-bezier(.36,.07,.19,.97)",
      },
      colors: {
        "hp-good": "#54e154",
        "hp-warn": "#ede47d",
        "hp-danger": "#ed7d7d",
        "enemy-hp": "#cf003d",
        hasitem: "#64a241",
      },
    },
  },
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#570DF8",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
