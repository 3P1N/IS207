import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["dist"],
    extends: [
      js.configs.recommended,                   // ESLint base
      react.configs.recommended,                // React rules
      reactHooks.configs["recommended-latest"], // React hooks
      reactRefresh.configs.vite,                // HMR safety
    ],
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react/jsx-no-undef": "error",            // 👉 bắt lỗi thiếu import
      "react/react-in-jsx-scope": "off",        // Vite tự thêm React 17+
      "import/no-unresolved": "error",          // 👉 bắt lỗi đường dẫn sai
    },
  },
]);
