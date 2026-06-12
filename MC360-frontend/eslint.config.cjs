module.exports = [
  // Ignore node_modules and build output
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  // Basic JS/React rules placeholder — keep empty to avoid blocking lint runs
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
];
