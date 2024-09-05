// @ts-check
import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default ts.config(
  {
    ignores: [
      "node_modules",
      "packages/*/node_modules",
      "packages/*/dist",
      "packages/*/coverage",
      "packages/*/build",
      "packages/*/.next",
    ],
  },

  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,

  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.node.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "no-console": "error",
      "no-debugger": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",

      /* currently eslint has issues with complex type trees and reports valid types as "error" typed */
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
);
