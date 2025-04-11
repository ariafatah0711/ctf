import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tseslint,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./src"]],
          extensions: [".ts", ".js", ".vue"],
        },
      },
    },
    ignores: ["dist", "node_modules"],
  },
];
