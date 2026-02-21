/** @type {import('lint-staged').Config} */
module.exports = {
  // TypeScript and JavaScript — lint and auto-fix
  '*.{ts,tsx,js,jsx}': [
    './node_modules/.bin/eslint --fix',
  ],
};

