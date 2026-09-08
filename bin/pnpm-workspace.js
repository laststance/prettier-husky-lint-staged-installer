import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Why: `-w` is only valid inside a pnpm workspace. When: installer cwd has pnpm-workspace.yaml. Called by {@link getPnpmSaveDevInstallArgs}.
 * @example isPnpmWorkspaceRoot()
 */
export function isPnpmWorkspaceRoot(cwd = process.cwd()) {
  return existsSync(join(cwd, 'pnpm-workspace.yaml'))
}

/**
 * Why: workspace-root `pnpm install --save-dev` throws ERR_PNPM_ADDING_TO_ROOT without `-w`. When: pnpm-lock.yaml is detected. Called by the pnpm branch of the CLI.
 * @example getPnpmSaveDevInstallArgs()
 */
export function getPnpmSaveDevInstallArgs(cwd = process.cwd()) {
  // pnpm rejects adding deps at workspace root unless -w is explicit
  if (isPnpmWorkspaceRoot(cwd)) {
    return ['install', '-w', '--save-dev', 'husky', 'lint-staged', 'prettier']
  }
  return ['install', '--save-dev', 'husky', 'lint-staged', 'prettier']
}
