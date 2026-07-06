import nextConfig from "eslint-config-next/core-web-vitals";
import nextTsConfig from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: ["*.js", "axiom-temp/**"] },
  ...nextConfig,
  ...nextTsConfig,
  {
    rules: {
      // Enforce no direct console.log in production paths (spec §9.2 rule 6)
      "no-console": ["warn", { allow: ["error", "warn"] }],
      // No any without justification (spec §10.1)
      "@typescript-eslint/no-explicit-any": "error",
      // Enforce explicit return types on functions (aids readability)
      "@typescript-eslint/explicit-function-return-type": "off",
      // Consistent type imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      // No unused variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
