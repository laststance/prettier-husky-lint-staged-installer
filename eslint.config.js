import tsPrefixer from 'eslint-config-ts-prefixer'

export default [
  {
    ignores: [
      '.vscode',
      'node_modules',
      'build',
      'dist',
      '.github',
      '.git',
      '.idea',
      '.next',
      '.husky',
      'storybook-static',
      '**/mockServiceWorker.js',
    ],
  },
  ...tsPrefixer,
]
