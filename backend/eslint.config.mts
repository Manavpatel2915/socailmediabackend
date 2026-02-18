import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import html from "./src/types/eslint-plugin-html";
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
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
      "no-debugger": "warn",
      "indent": ["error", 2],
      "space-before-blocks": "error",
      "brace-style": ["error", "1tbs", { allowSingleLine: false }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-before-function-paren': ['error', {
       anonymous: 'always',
       named: 'never',
       asyncArrow: 'always',
    }],
      'space-in-parens': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'space-infix-ops': 'error',
      'no-trailing-spaces': 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      "no-multiple-empty-lines": ["error", {
      max: 1,
      maxEOF: 1,
      maxBOF: 0
    }]
    },
  },
]);
