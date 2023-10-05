import { execSync } from 'child_process'
import { existsSync, readFile, writeFile } from 'fs'
import { intro, outro, spinner } from '@clack/prompts'
import { $ } from 'execa'

const p = spinner()
intro('Installing via husky, prettier, lint-staged...')
p.start()
if (existsSync('package-lock.json')) {
  await $`npx husky-init && npm install && npm install --save-dev lint-staged prettier`
}
if (existsSync('yarn.lock')) {
  await $`yarn dlx husky-init --yarn2 && yarn && yarn add --dev lint-staged prettier`
} else if (existsSync('pnpm-lock.yaml')) {
  await $`pnpm dlx husky-init && pnpm install && pnpm install --save-dev lint-staged prettier`
} else if (existsSync('bun.lockb')) {
  await $`bunx husky-init && bun install`
} else {
  // fallback to npm

  await $`npx husky-init && npm install && npm install --save-dev lint-staged prettier`
}
p.stop()
intro('Configration...')
p.start()
execSync('npm pkg set lint-staged.*="prettier --ignore-unknown --write"')
execSync('npm pkg set scripts.prettier="prettier --ignore-unknown --write ."')
const path = '.husky/pre-commit'
readFile(path, 'utf8', (err, data) => {
  if (err) throw err

  const result = data.replace(/npm test/g, 'npx lint-staged')

  writeFile(path, result, 'utf8', (err) => {
    if (err) throw err
  })
})
p.stop()

outro("You're all set!")
