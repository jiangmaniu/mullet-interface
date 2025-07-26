module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint'), 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  globals: {
    JSX: true,
    page: true,
    REACT_APP_ENV: true
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'trailing-comma': 'off', // 末尾不需要逗号
    'simple-import-sort/imports': 'off',
    'simple-import-sort/exports': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/display-name': 'off',
    'eslint-disable-next-line': 'off',
    'import/no-anonymous-default-export': 'off',
    'react-hooks/rules-of-hooks': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-async-promise-executor': 'off',
    'no-promise-executor-return': 'off',
    'array-callback-return': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-loop-func': 'off',
    'react/no-children-prop': 'off',
    '@typescript-eslint/ban-types': 'off',
    'prefer-rest-params': 'off',
    'react/no-string-refs': 'off',
    'guard-for-in': 'off',
    'react/button-has-type': 'off'
  }
}
