module.exports = {
  '**/*.(ts|tsx)': () => ['npx tsc --noEmit', 'npx eslint --fix src'],
  '**/*.(ts|tsx|md|json)': () => `npx prettier --write src`,
  '*.{css,scss,less}': ['stylelint --fix --custom-syntax postcss-scss']
}
