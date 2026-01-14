import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Loads a fixture file from the __fixtures__ directory
 */
export function loadFixture(filename: string): string {
  const fixturePath = join(__dirname, '__fixtures__', filename)
  return readFileSync(fixturePath, 'utf-8')
}

/**
 * Creates a mock module loader for a fixture
 */
export function createFixtureModule(filename: string): () => Promise<{ default: string }> {
  return () => Promise.resolve({ default: loadFixture(filename) })
}
