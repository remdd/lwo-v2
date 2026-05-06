module.exports = {
  extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  rules: {
    // Allow unused vars that start with _
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    // Prefer type over interface
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  },
};
