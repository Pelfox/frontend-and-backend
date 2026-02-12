import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  stylistic: false,
  typescript: true,
  gitignore: true,
  rules: {
    'no-console': 'off',
  },
});
