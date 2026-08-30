import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // ".netlify/**" holds the Netlify adapter's generated output (bundled functions and a copy
  // of the static export). It is gitignored, but ESLint walks the filesystem rather than the
  // git index, so without this a local `netlify deploy` makes `npm run lint` report thousands
  // of problems in generated code.
  {
    ignores: [
      ".next/**",
      ".netlify/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },
];

export default eslintConfig;
