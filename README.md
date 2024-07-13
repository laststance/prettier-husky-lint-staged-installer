[![Prettier](https://github.com/laststance/prettier-husky-lint-staged-installer/actions/workflows/prettier.yml/badge.svg)](https://github.com/laststance/prettier-husky-lint-staged-installer/actions/workflows/prettier.yml)
[![Lint](https://github.com/laststance/prettier-husky-lint-staged-installer/actions/workflows/lint.yml/badge.svg)](https://github.com/laststance/prettier-husky-lint-staged-installer/actions/workflows/lint.yml)
## prettier-husky-lint-staged-installer


Setup prettier fortmat staged files at precommit.  
After installation you'll got following setting automatically and
run prettier staged file when you git commit.

- `package.json`
```json
  "lint-staged": {
    "*": "prettier --ignore-unknown --write"
  }
```
- `.huskey/precommit`
```shell
npx lint-staged
```

# installation

Run script at your project root directory.

- npm
```shell
npx prettier-husky-lint-staged-installer
```
- pnpm
```shell
pnpm dlx prettier-husky-lint-staged-installer
```

- bun
```shell
bunx prettier-husky-lint-staged-installer
```

## LICENSE

[MIT](https://opensource.org/license/mit/)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://ryota-murakami.github.io/"><img src="https://avatars1.githubusercontent.com/u/5501268?s=400&u=7bf6b1580b95930980af2588ef0057f3e9ec1ff8&v=4?s=100" width="100px;" alt=""/><br /><sub><b>ryota-murakami</b></sub></a><br /><a href="https://github.com/laststance/create-react-app-vite/commits?author=ryota-murakami" title="Code">💻</a> <a href="https://github.com/laststance/create-react-app-vite/commits?author=ryota-murakami" title="Documentation">📖</a> <a href="https://github.com/laststance/create-react-app-vite/commits?author=ryota-murakami" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
