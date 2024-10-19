const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginReact = require("eslint-plugin-react");
const pluginReactHooks = require("eslint-plugin-react-hooks");
const pluginImport = require("eslint-plugin-import");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptEslintParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: globals.browser,
      parser: typescriptEslintParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      import: pluginImport,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],  // Make sure these extensions are included
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "react/jsx-uses-react": "off", // React 17+
      "react/react-in-jsx-scope": "off", // React 17+
      "react/prop-types": "off", // Disable prop-types with TypeScript
      "react-hooks/rules-of-hooks": "error", // Checks rules of hooks
      "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
      "import/no-unresolved": "error",
      "import/order": ["error", {
        "groups": [["builtin", "external", "internal"]],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true },
      }],
      "import/extensions": [
        "error",
        "ignorePackages",  // Ignore packages to avoid conflicts
        {
          "js": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never"    // Never require extensions in imports
        }
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      import: pluginImport,
    },
    rules: {
      "react/jsx-uses-react": "off", // React 17+
      "react/react-in-jsx-scope": "off", // React 17+
      "react/prop-types": "off",
    },
  },
];
