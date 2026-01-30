import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import html from "eslint-plugin-html";
import { defineConfig } from "eslint/config";

export default defineConfig([
  /* Base JavaScript rules */
  js.configs.recommended,

  /* TypeScript recommended rules */
  ...tseslint.configs.recommended,

  /* Ignore dist folder */
  {
    ignores: ["dist/**", "**/dist/**"],
  },

  /* Node + Express environment */
  {
    files: ["**/*.{js,ts}"],
    ignores: ["dist/**", "**/dist/**"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  /* Type-aware linting for TypeScript */
  {
    files: ["**/*.ts"],
    ignores: ["dist/**", "**/dist/**"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },

  /* EJS support */
  {
    files: ["**/*.ejs"],
    plugins: {
      html,
    },
    processor: "html/html",
  },

  /* Custom backend rules */
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
      "no-debugger": "warn",
    },
  },
]);
