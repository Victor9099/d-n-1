#!/usr/bin/env node

/**
 * Pi Agent Wrapper for Paseo
 * 
 * This script allows Paseo to launch Pi agents
 * Usage: node pi-paseo-wrapper.js <task> [mode] [model]
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const [,, task, mode = 'default', model = 'claude-sonnet-4'] = process.argv;

if (!task) {
  console.error('Usage: node pi-paseo-wrapper.js <task> [mode] [model]');
  process.exit(1);
}

console.log(`🚀 Launching Pi agent...`);
console.log(`   Task: ${task}`);
console.log(`   Mode: ${mode}`);
console.log(`   Model: ${model}`);
console.log();

// Build Pi command - use full path on Windows
const piPath = process.platform === 'win32' ? 'pi.cmd' : 'pi';
const args = ['--model', model];

if (mode === 'auto') {
  // Auto mode - non-interactive
  args.push('--print');
}

// Spawn Pi process
const pi = spawn(piPath, args, {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

// Send task to Pi
pi.stdin.write(task + '\n');
pi.stdin.end();

// Stream output
let output = '';

pi.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

pi.stderr.on('data', (data) => {
  process.stderr.write(`[Pi] ${data}`);
});

pi.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Pi agent completed successfully');
  } else {
    console.error(`\n❌ Pi agent exited with code ${code}`);
    process.exit(code);
  }
});

// Handle termination
process.on('SIGTERM', () => {
  pi.kill('SIGTERM');
});

process.on('SIGINT', () => {
  pi.kill('SIGINT');
});
