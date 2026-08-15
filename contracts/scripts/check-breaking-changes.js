#!/usr/bin/env node
/**
 * Breaking change detection for OpenAPI contracts.
 * Compares current openapi.yaml against committed baseline.
 *
 * Usage: node scripts/check-breaking-changes.js [baseline-path] [current-path]
 * Exit 0 = no breaking changes, Exit 1 = breaking changes detected
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import yaml from 'node:yaml'

const baselinePath = process.argv[2] || 'generated/baseline.yaml'
const currentPath = process.argv[3] || 'openapi.yaml'

function loadSpec(path) {
  return yaml.parse(readFileSync(path, 'utf-8'))
}

function extractOperations(spec) {
  const ops = new Map()
  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        ops.set(`${method.toUpperCase()} ${path}`, op)
      }
    }
  }
  return ops
}

function extractSchemas(spec) {
  return new Set(Object.keys(spec.components?.schemas || {}))
}

function checkBreakingChanges() {
  let baseline, current
  try {
    baseline = loadSpec(resolve(baselinePath))
    current = loadSpec(resolve(currentPath))
  } catch (e) {
    console.log(`No baseline found at ${baselinePath} — first run, no breaking changes`)
    process.exit(0)
  }

  const baselineOps = extractOperations(baseline)
  const currentOps = extractOperations(current)
  const baselineSchemas = extractSchemas(baseline)
  const currentSchemas = extractSchemas(current)

  const breakingChanges = []

  // Check for removed operations
  for (const [key] of baselineOps) {
    if (!currentOps.has(key)) {
      breakingChanges.push(`REMOVED operation: ${key}`)
    }
  }

  // Check for removed schemas
  for (const schema of baselineSchemas) {
    if (!currentSchemas.has(schema)) {
      breakingChanges.push(`REMOVED schema: ${schema}`)
    }
  }

  // Check for removed required fields in schemas
  for (const schemaName of baselineSchemas) {
    if (!currentSchemas.has(schemaName)) continue
    const baselineSchema = baseline.components.schemas[schemaName]
    const currentSchema = current.components.schemas[schemaName]
    if (!baselineSchema || !currentSchema) continue

    const baselineRequired = new Set(baselineSchema.required || [])
    const currentRequired = new Set(currentSchema.required || [])

    for (const field of baselineRequired) {
      if (!currentRequired.has(field)) {
        breakingChanges.push(`REMOVED required field: ${schemaName}.${field}`)
      }
    }
  }

  if (breakingChanges.length > 0) {
    console.error('BREAKING CHANGES DETECTED:')
    for (const change of breakingChanges) {
      console.error(`  - ${change}`)
    }
    console.error(`\n${breakingChanges.length} breaking change(s) found.`)
    console.error('These require integration-owner approval and deprecation window.')
    process.exit(1)
  }

  // Check for additive changes (informational)
  const addedOps = [...currentOps.keys()].filter(k => !baselineOps.has(k))
  const addedSchemas = [...currentSchemas].filter(s => !baselineSchemas.has(s))

  if (addedOps.length > 0 || addedSchemas.length > 0) {
    console.log('Additive changes (non-breaking):')
    for (const op of addedOps) console.log(`  + ${op}`)
    for (const schema of addedSchemas) console.log(`  + schema: ${schema}`)
  }

  console.log('No breaking changes detected.')
  process.exit(0)
}

checkBreakingChanges()
