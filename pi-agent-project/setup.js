#!/usr/bin/env node

/**
 * Pi Agent Core - Setup Script
 * Automated setup and configuration
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

/**
 * Check if command exists
 */
function commandExists(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check Node.js version
 */
function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);

  if (major < 18) {
    console.error(chalk.red(`✗ Node.js ${version} is too old. Required: >= 18.0.0`));
    process.exit(1);
  }

  console.log(chalk.green(`✓ Node.js ${version}`));
}

/**
 * Install dependencies
 */
async function installDependencies() {
  console.log(chalk.yellow('\n📦 Installing dependencies...'));

  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log(chalk.green('✓ Dependencies installed'));
  } catch (error) {
    console.error(chalk.red('✗ Failed to install dependencies'));
    process.exit(1);
  }
}

/**
 * Setup environment file
 */
async function setupEnvironment() {
  console.log(chalk.yellow('\n⚙️  Setting up environment...'));

  const envExample = path.join(process.cwd(), '.env.example');
  const envFile = path.join(process.cwd(), '.env');

  try {
    await fs.access(envFile);
    console.log(chalk.yellow('⚠ .env file already exists'));
    const overwrite = await question('Overwrite? (y/n): ');

    if (overwrite.toLowerCase() !== 'y') {
      console.log(chalk.cyan('Skipping .env setup'));
      return;
    }
  } catch {
    // File doesn't exist, continue
  }

  // Get API keys
  console.log(chalk.cyan('\nEnter your API keys (or press Enter to skip):'));

  const openaiKey = await question('OpenAI API Key: ');
  const anthropicKey = await question('Anthropic API Key: ');
  const googleKey = await question('Google API Key: ');
  const aiboxKey = await question('AI-Box API Key: ');

  // Read template
  let envContent = await fs.readFile(envExample, 'utf-8');

  // Replace placeholders
  if (openaiKey) envContent = envContent.replace('OPENAI_API_KEY=sk-your-openai-api-key', `OPENAI_API_KEY=${openaiKey}`);
  if (anthropicKey) envContent = envContent.replace('ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key', `ANTHROPIC_API_KEY=${anthropicKey}`);
  if (googleKey) envContent = envContent.replace('GOOGLE_API_KEY=your-google-api-key', `GOOGLE_API_KEY=${googleKey}`);
  if (aiboxKey) envContent = envContent.replace('AIBOX_API_KEY=sk-your-aibox-api-key', `AIBOX_API_KEY=${aiboxKey}`);

  // Write .env file
  await fs.writeFile(envFile, envContent);
  console.log(chalk.green('✓ .env file created'));
}

/**
 * Create directories
 */
async function createDirectories() {
  console.log(chalk.yellow('\n📁 Creating directories...'));

  const dirs = ['workflows', 'logs', 'examples'];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(chalk.green(`✓ Created ${dir}/`));
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(chalk.red(`✗ Failed to create ${dir}/`));
      }
    }
  }
}

/**
 * Test installation
 */
async function testInstallation() {
  console.log(chalk.yellow('\n🧪 Testing installation...'));

  try {
    // Import modules
    await import('./src/index.js');
    console.log(chalk.green('✓ Modules loaded successfully'));
  } catch (error) {
    console.error(chalk.red(`✗ Failed to load modules: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Display next steps
 */
function displayNextSteps() {
  console.log(chalk.cyan('\n╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║      Setup Complete! 🎉                  ║'));
  console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

  console.log(chalk.yellow('Next steps:\n'));

  console.log('1. Review your configuration:');
  console.log(chalk.gray('   nano .env\n'));

  console.log('2. Run the main agent:');
  console.log(chalk.gray('   npm start\n'));

  console.log('3. Try examples:');
  console.log(chalk.gray('   node src/orchestrator.js'));
  console.log(chalk.gray('   node src/pipeline.js'));
  console.log(chalk.gray('   node src/workflow.js\n'));

  console.log('4. Read documentation:');
  console.log(chalk.gray('   cat README.md\n'));

  console.log(chalk.green('Happy coding! 🚀\n'));
}

/**
 * Main setup function
 */
async function main() {
  console.log(chalk.cyan('╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║   Pi Agent Core - Setup                ║'));
  console.log(chalk.cyan('╚════════════════════════════════════════╝\n'));

  // Check prerequisites
  console.log(chalk.yellow('Checking prerequisites...'));
  checkNodeVersion();

  if (!commandExists('npm')) {
    console.error(chalk.red('✗ npm not found'));
    process.exit(1);
  }
  console.log(chalk.green('✓ npm found'));

  // Install dependencies
  await installDependencies();

  // Setup environment
  await setupEnvironment();

  // Create directories
  await createDirectories();

  // Test installation
  await testInstallation();

  // Display next steps
  displayNextSteps();

  rl.close();
}

// Run setup
main().catch(error => {
  console.error(chalk.red(`\nSetup failed: ${error.message}`));
  process.exit(1);
});
