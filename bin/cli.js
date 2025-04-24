#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, readFile, writeFile, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { intro, outro, spinner } from '@clack/prompts'
import { $ } from 'execa'

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Path to the templates directory
const TEMPLATES_DIR = join(__dirname, '..', 'templates')

const p = spinner()
intro('Installing via husky, prettier, lint-staged...')
p.start()

let precommitFileBody
if (existsSync('package-lock.json')) {
  precommitFileBody = 'npx lint-staged'
  await $`npm install --save-dev husky lint-staged prettier`
  await $`npx husky init`
  await $`npm install` // to refrect package.json
} else if (existsSync('pnpm-lock.yaml')) {
  precommitFileBody = 'pnpm lint-staged'
  await $`pnpm install --save-dev husky lint-staged prettier`
  await $`pnpm exec husky init`
  await $`pnpm install` // to refrect package.json
} else if (existsSync('bun.lockb')) {
  precommitFileBody = 'bunx lint-staged'
  await $`bun install -D husky lint-staged prettier`
  await $`bunx husky init`
  await $`bun install` // to refrect package.json
} else {
  p.stop()
  p.message('This project only support npm/pnpm/bun project.')
  outro('Finished.')
}
p.stop()
intro('Configration...')
p.start()
execSync('npm pkg set lint-staged.*="prettier --ignore-unknown --write"')
execSync('npm pkg set scripts.prettier="prettier --ignore-unknown --write ."')
// Copy .prettierignore to user's directory
try {
  copyFileSync(join(TEMPLATES_DIR, '.prettierignore'), './.prettierignore')
  // Copy .prettierrc to user's directory
  copyFileSync(join(TEMPLATES_DIR, '.prettierrc'), './.prettierrc')
} catch (error) {
  console.error('Error copying template files:', error.message)
  // Continue execution even if template copy fails
}

// replace "npm test" to  in $precommitExec '.husky/pre-commit'
const path = '.husky/pre-commit'
readFile(path, 'utf8', (err, data) => {
  if (err) throw err

  // overwrite .husky/pre-commit
  data = precommitFileBody

  writeFile(path, data, 'utf8', (err) => {
    if (err) throw err
  })
})
p.stop()

outro("You're all set!🎉")
