module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    requireConfigFile: false,
  },
  extends: [
    '@hastom/eslint-config/typescript-pure',
  ],
}
