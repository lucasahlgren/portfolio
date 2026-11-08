import base from "../../.prettierrc.json" with { type: "json" };

/** @type {import("prettier").Config} */
const config = {
  ...base,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/app/globals.css",
  tailwindFunctions: ["cn", "cva"],
};

export default config;
