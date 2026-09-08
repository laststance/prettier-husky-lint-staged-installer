import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  getPnpmSaveDevInstallArgs,
  isPnpmWorkspaceRoot,
} from '../bin/pnpm-workspace.js'

describe('pnpm workspace root install args', () => {
  let tmpDir

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'pnpm-workspace-'))
  })

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  it('adds -w so workspace-root pnpm install --save-dev does not throw ERR_PNPM_ADDING_TO_ROOT', async () => {
    // Arrange
    await writeFile(
      join(tmpDir, 'pnpm-workspace.yaml'),
      'packages:\n  - packages/*\n',
    )

    // Act
    const args = getPnpmSaveDevInstallArgs(tmpDir)

    // Assert
    expect(isPnpmWorkspaceRoot(tmpDir)).toBe(true)
    expect(args).toEqual([
      'install',
      '-w',
      '--save-dev',
      'husky',
      'lint-staged',
      'prettier',
    ])
  })

  it('omits -w for a single-package pnpm project so --workspace-root is not used outside a workspace', async () => {
    // Arrange: tmpDir has no pnpm-workspace.yaml

    // Act
    const args = getPnpmSaveDevInstallArgs(tmpDir)

    // Assert
    expect(isPnpmWorkspaceRoot(tmpDir)).toBe(false)
    expect(args).toEqual([
      'install',
      '--save-dev',
      'husky',
      'lint-staged',
      'prettier',
    ])
  })
})
