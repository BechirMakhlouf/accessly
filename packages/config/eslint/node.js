import globals from "globals";
import { config as baseConfig } from "./base.js";

export default [
  ...baseConfig,
  {
    files: ["**/*.{ts,js,tsx,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];
