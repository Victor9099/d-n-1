import { Agent } from 'pi-agent-core';
import chalk from 'chalk';

/**
 * Orchestrator Agent - Manages multiple sub-agents
 * Demonstrates multi-agent orchestration pattern
 */
class OrchestratorAgent extends Agent {
  constructor(config = {}) {
    super({
      name: 'Orchestrator',
      model: config.model || 'gpt-4',
      ...config
    });

    this.subAgents = new Map();
    this.initializeSubAgents();
  }

  /**
   * Initialize specialized sub-agents
   */
  initializeSubAgents() {
    // Code Agent - Handles code generation and review
    this.subAgents.set('code', new Agent({
      name: 'CodeAgent',
      model: 'gpt-4',
      systemPrompt: 'You are an expert software developer. Focus on writing clean, efficient, well-documented code.',
      temperature: 0.3
    }));

    // Analysis Agent - Handles data analysis and insights
    this.subAgents.set('analysis', new Agent({
      name: 'AnalysisAgent',
      model: 'gpt-4',
      systemPrompt: 'You are a data analyst. Provide detailed analysis with insights and recommendations.',
      temperature: 0.5
    }));

    // Creative Agent - Handles creative writing and ideation
    this.subAgents.set('creative', new Agent({
      name: 'CreativeAgent',
      model: 'gpt-4',
      systemPrompt: 'You are a creative writer. Generate innovative ideas and engaging content.',
      temperature: 0.9
    }));

    // Research Agent - Handles information gathering
    this.subAgents.set('research', new Agent({
      name: 'ResearchAgent',
      model: 'gpt-4',
      systemPrompt: 'You are a research assistant. Provide comprehensive, well-sourced information.',
      temperature: 0.4
    }));
  }

  /**
   * Route task to appropriate agent
   */
  async routeTask(task) {
    const taskLower = task.toLowerCase();

    if (taskLower.includes('code') || taskLower.includes('program') || taskLower.includes('implement')) {
      return 'code';
    }
    if (taskLower.includes('analyze') || taskLower.includes('data') || taskLower.includes('insight')) {
      return 'analysis';
    }
    if (taskLower.includes('creative') || taskLower.includes('write') || taskLower.includes('idea')) {
      return 'creative';
    }
    if (taskLower.includes('research') || taskLower.includes('find') || taskLower.includes('information')) {
      return 'research';
    }

    return 'code'; // Default
  }

  /**
   * Execute task with appropriate sub-agent
   */
  async execute(task, context = {}) {
    console.log(chalk.blue(`\n🎯 Orchestrator received: ${task}`));

    // Determine which agent to use
    const agentName = await this.routeTask(task);
    const subAgent = this.subAgents.get(agentName);

    console.log(chalk.cyan(`📤 Routing to ${agentName} agent...`));

    // Execute with sub-agent
    const result = await subAgent.run(task, context);

    console.log(chalk.green(`✅ Completed by ${agentName} agent`));

    return {
      agent: agentName,
      result: result,
      task: task
    };
  }

  /**
   * Execute task with multiple agents in parallel
   */
  async executeParallel(task, agentNames = ['code', 'analysis']) {
    console.log(chalk.blue(`\n🎯 Parallel execution: ${task}`));

    const agents = agentNames.map(name => this.subAgents.get(name));

    const promises = agents.map(async (agent, index) => {
      const result = await agent.run(task);
      return {
        agent: agentNames[index],
        result: result
      };
    });

    const results = await Promise.all(promises);

    console.log(chalk.green(`✅ Completed by ${results.length} agents`));

    return results;
  }

  /**
   * Execute task with agent pipeline
   */
  async executePipeline(task, pipeline = ['research', 'analysis', 'code']) {
    console.log(chalk.blue(`\n🎯 Pipeline execution: ${task}`));

    let currentInput = task;
    const results = [];

    for (const agentName of pipeline) {
      const agent = this.subAgents.get(agentName);
      console.log(chalk.cyan(`📤 Processing with ${agentName} agent...`));

      currentInput = await agent.run(currentInput);
      results.push({
        agent: agentName,
        output: currentInput
      });
    }

    console.log(chalk.green(`✅ Pipeline completed`));

    return results;
  }
}

/**
 * Example usage
 */
async function main() {
  console.log(chalk.cyan('╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║   Pi Agent Core - Orchestrator Demo    ║'));
  console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

  const orchestrator = new OrchestratorAgent();

  // Example 1: Single agent routing
  console.log(chalk.yellow('\n=== Example 1: Single Agent Routing ==='));
  const result1 = await orchestrator.execute('Write a Python function to sort a list');
  console.log('\nResult:', result1);

  // Example 2: Parallel execution
  console.log(chalk.yellow('\n=== Example 2: Parallel Execution ==='));
  const results2 = await orchestrator.executeParallel(
    'Analyze the benefits of microservices',
    ['research', 'analysis']
  );
  console.log('\nResults:', results2);

  // Example 3: Pipeline execution
  console.log(chalk.yellow('\n=== Example 3: Pipeline Execution ==='));
  const results3 = await orchestrator.executePipeline(
    'Build a recommendation system',
    ['research', 'analysis', 'code']
  );
  console.log('\nPipeline Results:', results3);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { OrchestratorAgent };
export default OrchestratorAgent;
