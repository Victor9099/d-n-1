import { Agent } from 'pi-agent-core';
import chalk from 'chalk';

/**
 * Pipeline Agent - Chains multiple AI operations
 * Demonstrates sequential processing pattern
 */
class PipelineAgent extends Agent {
  constructor(config = {}) {
    super({
      name: 'PipelineAgent',
      model: config.model || 'gpt-4',
      ...config
    });

    this.stages = new Map();
  }

  /**
   * Add a processing stage
   */
  addStage(name, processor) {
    this.stages.set(name, processor);
    return this;
  }

  /**
   * Execute pipeline with input
   */
  async execute(input) {
    console.log(chalk.blue(`\n🔄 Starting pipeline with: ${input}\n`));

    let currentData = input;
    const stageResults = [];

    for (const [stageName, processor] of this.stages) {
      console.log(chalk.cyan(`⚙️  Processing stage: ${stageName}`));

      try {
        currentData = await processor(currentData);
        stageResults.push({
          stage: stageName,
          output: currentData,
          status: 'success'
        });
        console.log(chalk.green(`   ✓ Completed`));
      } catch (error) {
        stageResults.push({
          stage: stageName,
          error: error.message,
          status: 'failed'
        });
        console.log(chalk.red(`   ✗ Failed: ${error.message}`));
        throw error;
      }
    }

    console.log(chalk.green(`\n✅ Pipeline completed successfully\n`));

    return {
      finalOutput: currentData,
      stages: stageResults
    };
  }
}

/**
 * Create a code generation pipeline
 */
export function createCodePipeline() {
  const pipeline = new PipelineAgent();

  // Stage 1: Requirements Analysis
  pipeline.addStage('requirements', async (input) => {
    const agent = new Agent({
      name: 'RequirementsAnalyst',
      systemPrompt: 'You analyze requirements and extract key features, constraints, and specifications.'
    });

    return await agent.run(`Analyze these requirements and list key features:\n\n${input}`);
  });

  // Stage 2: Architecture Design
  pipeline.addStage('architecture', async (requirements) => {
    const agent = new Agent({
      name: 'Architect',
      systemPrompt: 'You design software architecture based on requirements.'
    });

    return await agent.run(`Design architecture for:\n\n${requirements}`);
  });

  // Stage 3: Code Generation
  pipeline.addStage('code', async (architecture) => {
    const agent = new Agent({
      name: 'Developer',
      systemPrompt: 'You write clean, efficient code based on architecture specifications.',
      temperature: 0.3
    });

    return await agent.run(`Implement code based on this architecture:\n\n${architecture}`);
  });

  // Stage 4: Code Review
  pipeline.addStage('review', async (code) => {
    const agent = new Agent({
      name: 'Reviewer',
      systemPrompt: 'You review code for bugs, improvements, and best practices.',
      temperature: 0.2
    });

    return await agent.run(`Review this code and suggest improvements:\n\n${code}`);
  });

  return pipeline;
}

/**
 * Create a content creation pipeline
 */
export function createContentPipeline() {
  const pipeline = new PipelineAgent();

  // Stage 1: Research
  pipeline.addStage('research', async (topic) => {
    const agent = new Agent({
      name: 'Researcher',
      systemPrompt: 'You research topics thoroughly and provide comprehensive information.'
    });

    return await agent.run(`Research this topic:\n\n${topic}`);
  });

  // Stage 2: Outline
  pipeline.addStage('outline', async (research) => {
    const agent = new Agent({
      name: 'Planner',
      systemPrompt: 'You create structured outlines from research material.'
    });

    return await agent.run(`Create an outline based on this research:\n\n${research}`);
  });

  // Stage 3: Draft
  pipeline.addStage('draft', async (outline) => {
    const agent = new Agent({
      name: 'Writer',
      systemPrompt: 'You write engaging content based on outlines.',
      temperature: 0.8
    });

    return await agent.run(`Write content based on this outline:\n\n${outline}`);
  });

  // Stage 4: Edit
  pipeline.addStage('edit', async (draft) => {
    const agent = new Agent({
      name: 'Editor',
      systemPrompt: 'You edit and improve content for clarity and engagement.',
      temperature: 0.4
    });

    return await agent.run(`Edit and improve this content:\n\n${draft}`);
  });

  return pipeline;
}

/**
 * Create a data analysis pipeline
 */
export function createAnalysisPipeline() {
  const pipeline = new PipelineAgent();

  // Stage 1: Data Collection
  pipeline.addStage('collect', async (query) => {
    const agent = new Agent({
      name: 'DataCollector',
      systemPrompt: 'You identify what data needs to be collected for analysis.'
    });

    return await agent.run(`What data should be collected for:\n\n${query}`);
  });

  // Stage 2: Data Processing
  pipeline.addStage('process', async (dataPlan) => {
    const agent = new Agent({
      name: 'DataProcessor',
      systemPrompt: 'You design data processing pipelines and transformations.'
    });

    return await agent.run(`Design processing pipeline for:\n\n${dataPlan}`);
  });

  // Stage 3: Analysis
  pipeline.addStage('analyze', async (processingPlan) => {
    const agent = new Agent({
      name: 'Analyst',
      systemPrompt: 'You perform detailed data analysis and extract insights.'
    });

    return await agent.run(`Analyze and extract insights from:\n\n${processingPlan}`);
  });

  // Stage 4: Visualization
  pipeline.addStage('visualize', async (insights) => {
    const agent = new Agent({
      name: 'Visualizer',
      systemPrompt: 'You create data visualization recommendations.'
    });

    return await agent.run(`Recommend visualizations for these insights:\n\n${insights}`);
  });

  return pipeline;
}

/**
 * Example usage
 */
async function main() {
  console.log(chalk.cyan('╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║   Pi Agent Core - Pipeline Demo        ║'));
  console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

  // Example 1: Code Pipeline
  console.log(chalk.yellow('\n=== Code Generation Pipeline ===\n'));
  const codePipeline = createCodePipeline();
  const codeResult = await codePipeline.execute(
    'Build a REST API for user authentication with JWT tokens'
  );
  console.log('\nFinal Output:', codeResult.finalOutput.substring(0, 200) + '...\n');

  // Example 2: Content Pipeline
  console.log(chalk.yellow('\n=== Content Creation Pipeline ===\n'));
  const contentPipeline = createContentPipeline();
  const contentResult = await contentPipeline.execute(
    'The future of AI in software development'
  );
  console.log('\nFinal Output:', contentResult.finalOutput.substring(0, 200) + '...\n');

  // Example 3: Analysis Pipeline
  console.log(chalk.yellow('\n=== Data Analysis Pipeline ===\n'));
  const analysisPipeline = createAnalysisPipeline();
  const analysisResult = await analysisPipeline.execute(
    'Analyze user engagement metrics for our web application'
  );
  console.log('\nFinal Output:', analysisResult.finalOutput.substring(0, 200) + '...\n');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { PipelineAgent };
export default PipelineAgent;
