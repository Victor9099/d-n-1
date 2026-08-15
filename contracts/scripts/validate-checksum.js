#!/usr/bin/env node
/**
 * Validate that generated artifacts match the current openapi.yaml checksum.
 * CI fails if openapi.yaml changed but generated artifacts were not regenerated.
 *
 * Usage: node scripts/validate-checksum.js
 * Exit 0 = checksums match, Exit 1 = mismatch (need to regenerate)
 */
import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const openapiPath = resolve(__dirname, '../openapi.yaml')
const checksumPath = resolve(__dirname, '../generated/openapi.sha256')

if (!existsSync(checksumPath)) {
  console.error('ERROR: No checksum file found. Run `bun run codegen` first.')
  process.exit(1)
}

const currentContent = readFileSync(openapiPath, 'utf-8')
const currentHash = createHash('sha256').update(currentContent).digest('hex')

const storedChecksum = readFileSync(checksumPath, 'utf-8').trim()
const storedHash = storedChecksum.split(/\s+/)[0]

if (currentHash !== storedHash) {
  console.error('CHECKSUM MISMATCH!')
  console.error(`  Current openapi.yaml:  ${currentHash}`)
  console.error(`  Committed checksum:    ${storedHash}`)
  console.error('\nopenapi.yaml has changed but generated artifacts were not regenerated.')
  console.error('Run `bun run codegen` and commit the updated generated/ files.')
  process.exit(1)
}

console.log(`Checksum verified: ${currentHash}`)
console.log('Generated artifacts are up to date.')
process.exit(0)
