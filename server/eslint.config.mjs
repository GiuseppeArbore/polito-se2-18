import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
    ignores: ["node_modules/", "public/", ".husky/", "**/*.css", "**/*.scss", "**/*.js", "**/*.jsx"],
  },
];
