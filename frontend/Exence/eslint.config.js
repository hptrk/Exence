// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "ex",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "ex",
          style: "kebab-case",
        },
      ],
      // TS naming conventions
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
        {
          selector: ["classProperty"],
          format: ["PascalCase"],
          filter: {
            regex: ".*Enum",
            match: true,
          },
        },
        {
          selector: ["classProperty"],
          format: ["UPPER_CASE"],
          modifiers: ["readonly"],
        },
        {
          selector: ["classProperty"],
          format: ["UPPER_CASE"],
          modifiers: ["static"],
        },
        {
          selector: ["variable", "classProperty", "method"],
          format: ["camelCase"],
        },
        {
          selector: ["variable"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          modifiers: ["const", "exported"],
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "allow-as-parameter",
        },
      ],
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",

      // JS base rules
      "brace-style": ["error", "1tbs"],
      "id-blacklist": "off",
      "id-match": "off",
      "max-len": [
        "error",
        {
          ignorePattern: "^import [^,]+ from |^export | implements",
          code: 150,
        },
      ],
      "no-underscore-dangle": "off",
      "jsdoc/newline-after-description": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
