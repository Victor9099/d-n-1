#!/usr/bin/env node
// Compute SHA-256 checksum of openapi.yaml for change detection
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const openapiPath = resolve(__dirname, '../openapi.yaml')
const checksumPath = resolve(__dirname, '../generated/openapi.sha256')

const content = readFileSync(openapiPath, 'utf-8')
const hash = createHash('sha256').update(content).digest('hex')

writeFileSync(checksumPath, `${hash}  openapi.yaml\n`, 'utf-8')
console.log(`Checksum: ${hash}`)
console.log('Written to generated/openapi.sha256')
