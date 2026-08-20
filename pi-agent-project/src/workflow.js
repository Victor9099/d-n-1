import { Agent } from 'pi-agent-core';
import chalk from 'chalk';
import fs from 'fs/promises';

/**
 * Workflow Agent - Manages complex multi-step workflows
 * Demonstrates state management and workflow automation
 */
class WorkflowAgent extends Agent {
  constructor(config = {}) {
    super({
      name: 'WorkflowAgent',
      model: config.model || 'gpt-4',
      ...config
    });

    this.workflows = new Map();
    this.currentWorkflow = null;
    this.workflowState = {
      currentStep: 0,
      completed: false,
      results: [],
      errors: []
    };
  }

  /**
   * Define a workflow
   */
  defineWorkflow(name, steps) {
    this.workflows.set(name, {
      name,
      steps,
      createdAt: Date.now()
    });
    return this;
  }

  /**
   * Load workflow from file
   */
  async loadWorkflow(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const workflow = JSON.parse(content);
      this.workflows.set(workflow.name, workflow);
      console.log(chalk.green(`✓ Workflow loaded: ${workflow.name}`));
      return workflow;
    } catch (error) {
      console.error(chalk.red(`✗ Failed to load workflow: ${error.message}`));
      throw error;
    }
  }

  /**
   * Save workflow to file
   */
  async saveWorkflow(name, filePath) {
    const workflow = this.workflows.get(name);
    if (!workflow) {
      throw new Error(`Workflow not found: ${name}`);
    }

    try {
      await fs.writeFile(filePath, JSON.stringify(workflow, null, 2));
      console.log(chalk.green(`✓ Workflow saved: ${filePath}`));
    } catch (error) {
      console.error(chalk.red(`✗ Failed to save workflow: ${error.message}`));
      throw error;
    }
  }

  /**
   * Start a workflow
   */
  async startWorkflow(name, initialInput = '') {
    const workflow = this.workflows.get(name);
    if (!workflow) {
      throw new Error(`Workflow not found: ${name}`);
    }

    this.currentWorkflow = workflow;
    this.workflowState = {
      currentStep: 0,
      completed: false,
      results: [],
      errors: [],
      startTime: Date.now(),
      input: initialInput
    };

    console.log(chalk.blue(`\n🚀 Starting workflow: ${name}`));
    console.log(chalk.cyan(`   Steps: ${workflow.steps.length}`));

    return await this.executeNextStep();
  }

  /**
   * Execute next step in workflow
   */
  async executeNextStep() {
    if (!this.currentWorkflow) {
      throw new Error('No workflow started');
    }

    if (this.workflowState.currentStep >= this.currentWorkflow.steps.length) {
      this.workflowState.completed = true;
      console.log(chalk.green(`\n✅ Workflow completed`));
      return this.workflowState.results;
    }

    const step = this.currentWorkflow.steps[this.workflowState.currentStep];
    console.log(chalk.cyan(`\n⚙️  Step ${this.workflowState.currentStep + 1}: ${step.name}`));

    try {
      // Get input for this step
      const input = step.usePreviousOutput && this.workflowState.results.length > 0
        ? this.workflowState.results[this.workflowState.results.length - 1].output
        : step.input || this.workflowState.input;

      // Execute step
      const agent = new Agent({
        name: step.agent || 'StepAgent',
        model: step.model || this.model,
        systemPrompt: step.systemPrompt || step.prompt,
        temperature: step.temperature || 0.7
      });

      const output = await agent.run(step.task || input);

      // Store result
      this.workflowState.results.push({
        step: step.name,
        input: input,
        output: output,
        timestamp: Date.now()
      });

      console.log(chalk.green(`   ✓ Step completed`));

      // Move to next step
      this.workflowState.currentStep++;

      // Continue if auto-advance
      if (step.autoAdvance !== false) {
        return await this.executeNextStep();
      }

      return output;

    } catch (error) {
      console.error(chalk.red(`   ✗ Step failed: ${error.message}`));

      this.workflowState.errors.push({
        step: step.name,
        error: error.message,
        timestamp: Date.now()
      });

      if (step.retryOnError) {
        console.log(chalk.yellow(`   Retrying...`));
        return await this.executeNextStep();
      }

      throw error;
    }
  }

  /**
   * Get workflow status
   */
  getStatus() {
    if (!this.currentWorkflow) {
      return { status: 'idle' };
    }

    return {
      workflow: this.currentWorkflow.name,
      currentStep: this.workflowState.currentStep,
      totalSteps: this.currentWorkflow.steps.length,
      completed: this.workflowState.completed,
      results: this.workflowState.results.length,
      errors: this.workflowState.errors.length,
      duration: Date.now() - this.workflowState.startTime
    };
  }

  /**
   * Reset workflow
   */
  reset() {
    this.currentWorkflow = null;
    this.workflowState = {
      currentStep: 0,
      completed: false,
      results: [],
      errors: []
    };
    console.log(chalk.yellow('🔄 Workflow reset'));
  }
}

/**
 * Pre-defined workflows
 */
export const WORKFLOWS = {
  // Code Review Workflow
  codeReview: {
    name: 'code-review',
    steps: [
      {
        name: 'Read Code',
        task: 'Read and understand the code structure',
        autoAdvance: true
      },
      {
        name: 'Analyze Bugs',
        task: 'Identify potential bugs and issues',
        usePreviousOutput: true,
        autoAdvance: true
      },
      {
        name: 'Check Security',
        task: 'Check for security vulnerabilities',
        usePreviousOutput: true,
        autoAdvance: true
      },
      {
        name: 'Performance',
        task: 'Analyze performance implications',
        usePreviousOutput: true,
        autoAdvance: true
      },
      {
        name: 'Generate Report',
        task: 'Generate comprehensive review report',
        usePreviousOutput: true
      }
    ]
  },

  // Feature Development Workflow
  featureDevelopment: {
    name: 'feature-development',
    steps: [
      {
        name: 'Requirements',
        task: 'Analyze and document requirements',
        autoAdvance: true
      },
      {
        name: 'Design',
        task: 'Design the solution architecture',
        usePreviousOutput: true,
        autoAdvance: true
      },
      {
        name: 'Implementation',
        task: 'Implement the solution',
        usePreviousOutput: true,
        temperature: 0.3,
        autoAdvance: true
      },
      {
        name: 'Testing',
        task: 'Write tests for the implementation',
        usePreviousOutput: true,
        autoAdvance: true
      },
      {
        name: 'Documentation',
        task: 'Document the feature',
        usePreviousOutput: true
      }
    ]
  },

  // Bug Fix Workflow
  bugFix: {
    name: 'bug-fix',
    steps: [
      {
        name: 'Analyze Bug',
        task: 'Analyze the bug report and identify root cause',
        autoAdvance: true
      },
      {
        name: 'Reproduce',
        task: 'Create steps to reproduce the bug',
        usePreviousOutput: true,
        autoAdvance: true
      },
      {
        name: 'Fix',
        task: 'Implement the fix',
        usePreviousOutput: true,
        temperature: 0.3,
        autoAdvance: true
      },
      {
        name: 'Test',
        task: 'Write tests to verify the fix',
        usePreviousOutput: true
      }
    ]
  }
};

/**
 * Example usage
 */
async function main() {
  console.log(chalk.cyan('╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║   Pi Agent Core - Workflow Demo        ║'));
  console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

  const workflowAgent = new WorkflowAgent();

  // Example 1: Code Review Workflow
  console.log(chalk.yellow('\n=== Code Review Workflow ===\n'));
  workflowAgent.defineWorkflow('code-review', WORKFLOWS.codeReview.steps);
  const reviewResults = await workflowAgent.startWorkflow(
    'code-review',
    'Review the authentication module in auth.js'
  );
  console.log('\nStatus:', workflowAgent.getStatus());

  // Reset for next workflow
  workflowAgent.reset();

  // Example 2: Feature Development Workflow
  console.log(chalk.yellow('\n=== Feature Development Workflow ===\n'));
  workflowAgent.defineWorkflow('feature-dev', WORKFLOWS.featureDevelopment.steps);
  const devResults = await workflowAgent.startWorkflow(
    'feature-dev',
    'Add user profile management feature'
  );
  console.log('\nStatus:', workflowAgent.getStatus());

  // Reset for next workflow
  workflowAgent.reset();

  // Example 3: Bug Fix Workflow
  console.log(chalk.yellow('\n=== Bug Fix Workflow ===\n'));
  workflowAgent.defineWorkflow('bug-fix', WORKFLOWS.bugFix.steps);
  const fixResults = await workflowAgent.startWorkflow(
    'bug-fix',
    'Fix login timeout issue in production'
  );
  console.log('\nStatus:', workflowAgent.getStatus());

  // Save workflow
  console.log(chalk.yellow('\n=== Saving Workflow ===\n'));
  await workflowAgent.saveWorkflow('bug-fix', './workflows/bug-fix.json');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { WorkflowAgent, WORKFLOWS };
export default WorkflowAgent;
