import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import {
  mkdir,
  mkdtemp,
  writeFile,
  readFile,
  existsSync,
  rm,
} from 'node:fs/promises'
import { exec } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

// Skip these tests in CI environment
const isCI = process.env.CI === 'true'

describe('E2E CLI Tests', () => {
  let tmpDir

  beforeEach(async () => {
    // Create a temporary directory for testing
    tmpDir = await mkdtemp(join(tmpdir(), 'cli-test-'))
  })

  afterEach(async () => {
    // Clean up the temporary directory
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true })
    }
  })

  it.skipIf(isCI)(
    'should install and configure files for npm project',
    async () => {
      // Create a simple npm project
      await mkdir(join(tmpDir, 'npm-project'))
      await writeFile(
        join(tmpDir, 'npm-project', 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      )
      await writeFile(
        join(tmpDir, 'npm-project', 'package-lock.json'),
        JSON.stringify({}),
      )

      // Run the CLI in the project
      const cliPath = join(process.cwd(), 'bin', 'cli.js')

      try {
        await execAsync(`node ${cliPath}`, { cwd: join(tmpDir, 'npm-project') })

        // Check if config files were created
        expect(existsSync(join(tmpDir, 'npm-project', '.prettierrc'))).toBe(
          true,
        )
        expect(existsSync(join(tmpDir, 'npm-project', '.prettierignore'))).toBe(
          true,
        )
        expect(
          existsSync(join(tmpDir, 'npm-project', '.husky', 'pre-commit')),
        ).toBe(true)

        // Check if package.json was updated
        const pkgJson = JSON.parse(
          await readFile(join(tmpDir, 'npm-project', 'package.json'), 'utf8'),
        )
        expect(pkgJson.scripts).toHaveProperty('prettier')
        expect(pkgJson).toHaveProperty('lint-staged')
      } catch (error) {
        console.error('E2E test error:', error)
        throw error
      }
    },
    60000,
  ) // Allow 60 seconds for this test
})
