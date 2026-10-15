import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Pin Tailwind's base to this project directory instead of relying on
// `process.cwd()`. Otherwise Tailwind resolves `tailwindcss` relative to
// wherever the command was launched and fails with:
//   "Can't resolve 'tailwindcss' in '<some parent dir>'"
const base = dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": { base },
  },
};

export default config;
