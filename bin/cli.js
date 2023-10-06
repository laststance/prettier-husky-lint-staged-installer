#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, readFile, writeFile } from 'node:fs'
import { intro, outro, spinner } from '@clack/prompts'
import { $ } from 'execa'

const p = spinner()
intro('Installing via husky, prettier, lint-staged...')
p.start()

let precommitExec
if (existsSync('package-lock.json')) {
  precommitExec = 'npm lint-staged'
  await $`npm install --save-dev lint-staged prettier`
  await $`npx husky-init && npm install`
}
if (existsSync('yarn.lock')) {
  precommitExec = 'yarn lint-staged'
  await $`yarn add -D lint-staged prettier`
  await $`yarn dlx husky-init --yarn2`
} else if (existsSync('pnpm-lock.yaml')) {
  precommitExec = 'npm lint-staged'
  await $`pnpm install --save-dev lint-staged prettier`
  await $`pnpm dlx husky-init && pnpm install`
} else if (existsSync('bun.lockb')) {
  precommitExec = 'npm lint-staged'
  await $`bun install -D lint-staged prettier`
  await $`bunx husky-init && bun install`
} else {
  // fallback to npm
  precommitExec = 'npm lint-staged'
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
  const result = data.replace(/npm test/g, precommitExec)

  writeFile(path, result, 'utf8', (err) => {
    if (err) throw err
  })
})
p.stop()

outro("You're all set!")
