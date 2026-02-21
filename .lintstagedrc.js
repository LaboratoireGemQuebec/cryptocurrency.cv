/** @type {import('lint-staged').Config} */
module.exports = {
  // TypeScript and JavaScript — lint and auto-fix
  '*.{ts,tsx,js,jsx}': [
    'npx eslint --fix',
  ],

  // Type checking for TypeScript files (run after lint fix)
  '*.{ts,tsx}': () => 'tsc --noEmit',
};

