import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".pnpm-store/**",
      "coverage/**",
      "exports/**",
      ".tools/**",
      "public/**",
      "next-env.d.ts",
      // Exported design-prototype bundle — reference only, not project source.
      "docs/design-handoff/**/prototype/**"
    ]
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      "no-debugger": "error",
      "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
      "no-var": "error",
      "prefer-const": "error"
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-explicit-any": "error"
    }
  }
];

export default eslintConfig;
