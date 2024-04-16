module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "airbnb", "airbnb-typescript", "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ['dist'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "project": "./tsconfig.json",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  plugins: ['prettier'],
  rules: {
    "strict": ["error", "never"],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-console": ["error", { "allow": ["error"] }],
    "react/react-in-jsx-scope": "off",
    "indent": "off",
    "no-useless-catch": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off"
  },
}
