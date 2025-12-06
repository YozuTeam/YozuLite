/**
 * ESLint Configuration - Enterprise Grade
 *
 * This configuration follows industry best practices for TypeScript/React projects.
 * Organization: YozuLite
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ============================================================================
// CONFIGURATION
// ============================================================================

const eslintConfig = defineConfig([
  // ---------------------------------------------------------------------------
  // Base Configurations
  // ---------------------------------------------------------------------------
  ...nextVitals,
  ...nextTs,

  // ---------------------------------------------------------------------------
  // TypeScript & React Rules
  // ---------------------------------------------------------------------------
  {
    name: "yozu/typescript-react",
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      // -----------------------------------------------------------------------
      // TypeScript - Strict Type Safety
      // -----------------------------------------------------------------------
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

      // -----------------------------------------------------------------------
      // React - Hooks & Best Practices
      // -----------------------------------------------------------------------
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "warn",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react/self-closing-comp": ["error", { component: true, html: true }],

      // -----------------------------------------------------------------------
      // Import Organization
      // -----------------------------------------------------------------------
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",

      // -----------------------------------------------------------------------
      // General JavaScript/TypeScript Quality
      // -----------------------------------------------------------------------
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "all"],
      "no-throw-literal": "error",
      "prefer-template": "error",
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",
      "spaced-comment": ["error", "always", { markers: ["/"] }],
      "no-duplicate-imports": "off", // Handled by import/no-duplicates
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message:
            "for..in loops iterate over the entire prototype chain. Use Object.keys() instead.",
        },
      ],

      // -----------------------------------------------------------------------
      // Code Complexity & Maintainability
      // -----------------------------------------------------------------------
      "max-depth": ["warn", 4],
      "max-lines-per-function": [
        "warn",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["warn", 15],
    },
  },

  // ---------------------------------------------------------------------------
  // Test Files Configuration
  // ---------------------------------------------------------------------------
  {
    name: "yozu/test-files",
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/jest.setup.ts",
    ],
    rules: {
      // Relaxed rules for test files
      "@typescript-eslint/no-explicit-any": "off",
      "max-lines-per-function": "off",
      "no-console": "off",
    },
  },

  // ---------------------------------------------------------------------------
  // Component-Specific Overrides
  // ---------------------------------------------------------------------------
  {
    name: "yozu/theme-provider",
    files: ["**/_providers/theme.tsx"],
    rules: {
      "@next/next/no-async-client-component": "off",
    },
  },

  // ---------------------------------------------------------------------------
  // Global Ignores
  // ---------------------------------------------------------------------------
  globalIgnores([
    // Build outputs
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",

    // Dependencies
    "node_modules/**",

    // Config files (handled separately or by other tools)
    "*.config.{js,mjs,ts}",

    // Generated files
    "next-env.d.ts",
    "*.generated.*",

    // Test coverage
    "coverage/**",
    ".jest/**",

    // IDE
    ".idea/**",
    ".vscode/**",

    // OS files
    ".DS_Store",
    "Thumbs.db",
  ]),
]);

export default eslintConfig;
