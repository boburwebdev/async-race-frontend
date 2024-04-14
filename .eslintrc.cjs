module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "airbnb", "airbnb/typescript", "plugin:@typescript-eslint/recommended", "prettier",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  plugins: ['react-refresh'],
  rules: {
    "strict": ["error", "never"]
  },
}
