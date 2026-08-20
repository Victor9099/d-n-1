#!/usr/bin/env node

/**
 * Pi Agent Core - Quick Start Demo
 * Run this to see Pi Agent Core in action
 */

import { MainAgent } from './src/agent.js';
import { OrchestratorAgent } from './src/orchestrator.js';
import { createCodePipeline } from './src/pipeline.js';
import { WorkflowAgent, WORKFLOWS } from './src/workflow.js';
import chalk from 'chalk';

console.log(chalk.cyan('╔════════════════════════════════════════╗'));
console.log(chalk.cyan('║   Pi Agent Core - Quick Start Demo     ║'));
console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

/**
 * Demo 1: Basic Agent
 */
async function demo1() {
  console.log(chalk.yellow('\n=== Demo 1: Basic Agent ===\n'));

  const agent = new MainAgent({
    name: 'DemoAgent',
    model: 'gpt-4'
  });

  console.log('Task: Explain what is Node.js in one sentence');
  const result = await agent.execute('Explain what is Node.js in one sentence');
  console.log(chalk.green('\nResult:'), result);
}

/**
 * Demo 2: Agent with Tools
 */
async function demo2() {
  console.log(chalk.yellow('\n\n=== Demo 2: Agent with Custom Tools ===\n'));

  const agent = new MainAgent({
    name: 'ToolAgent'
  });

  // Add calculator tool
  agent.addTool({
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      expression: { type: 'string', description: 'Math expression' }
    },
    execute: async ({ expression }) => {
      try {
        const result = Function(`"use strict"; return (${expression})`)();
        return { result };
      } catch (error) {
        return { error: error.message };
      }
    }
  });

  console.log('Task: Calculate 15 * 23 + 47');
  const result = await agent.execute('Calculate 15 * 23 + 47 using the calculate tool');
  console.log(chalk.green('\nResult:'), result);
}

/**
 * Demo 3: Orchestrator
 */
async function demo3() {
  console.log(chalk.yellow('\n\n=== Demo 3: Orchestrator Agent ===\n'));

  const orchestrator = new OrchestratorAgent();

  console.log('Task: Write a Python function to sort a list');
  const result = await orchestrator.execute('Write a Python function to sort a list');
  console.log(chalk.green('\nRouted to:'), result.agent);
  console.log(chalk.green('Result:'), result.result.substring(0, 200) + '...');
}

/**
 * Demo 4: Pipeline
 */
async function demo4() {
  console.log(chalk.yellow('\n\n=== Demo 4: Pipeline Processing ===\n'));

  const pipeline = createCodePipeline();

  console.log('Task: Build a simple REST API');
  console.log(chalk.gray('Pipeline: Requirements → Architecture → Code → Review\n'));

  const result = await pipeline.execute('Build a simple REST API with user authentication');

  console.log(chalk.green('\nPipeline Stages:'));
  result.stages.forEach((stage, index) => {
    console.log(`  ${index + 1}. ${stage.stage} - ${stage.status}`);
  });

  console.log(chalk.green('\nFinal Output:'), result.finalOutput.substring(0, 200) + '...');
}

/**
 * Demo 5: Workflow
 */
async function demo5() {
  console.log(chalk.yellow('\n\n=== Demo 5: Workflow Automation ===\n'));

  const workflow = new WorkflowAgent();

  console.log('Task: Fix login bug in production');
  console.log(chalk.gray('Workflow: Analyze → Reproduce → Fix → Test\n'));

  workflow.defineWorkflow('bug-fix', WORKFLOWS.bugFix.steps);
  const results = await workflow.startWorkflow('bug-fix', 'Fix login timeout issue');

  console.log(chalk.green('\nWorkflow Status:'));
  const status = workflow.getStatus();
  console.log(`  Completed: ${status.completed}`);
  console.log(`  Steps: ${status.currentStep}/${status.totalSteps}`);
  console.log(`  Duration: ${status.duration}ms`);
}

/**
 * Run all demos
 */
async function runAllDemos() {
  try {
    await demo1();
    await demo2();
    await demo3();
    await demo4();
    await demo5();

    console.log(chalk.cyan('\n\n╔════════════════════════════════════════╗'));
    console.log(chalk.cyan('║      All Demos Completed! 🎉             ║'));
    console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

    console.log(chalk.yellow('Next steps:'));
    console.log('  1. Read GUIDE-VI.md for detailed documentation');
    console.log('  2. Check examples/ for more use cases');
    console.log('  3. Build your own agents!\n');

  } catch (error) {
    console.error(chalk.red('\nDemo failed:'), error.message);
    console.error(chalk.gray('\nStack trace:'), error.stack);
  }
}

// Run demos
runAllDemos();
