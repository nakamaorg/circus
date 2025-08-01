import dx from "@eoussama/dx";



export default dx({
  ignores: [
    // Dependencies
    "node_modules/**",
    ".pnpm-store/**",

    // Build outputs
    ".next/**",
    "out/**",
    "dist/**",

    // Environment files
    ".env*",

    // Other
    ".vercel/**",
    "coverage/**",
  ],
});
