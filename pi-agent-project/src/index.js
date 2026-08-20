// Pi Agent Core - Main Entry Point
// Exports all modules and provides quick access

export { MainAgent } from './agent.js';
export { OrchestratorAgent } from './orchestrator.js';
export { PipelineAgent, createCodePipeline, createContentPipeline, createAnalysisPipeline } from './pipeline.js';
export { WorkflowAgent, WORKFLOWS } from './workflow.js';
export { Config } from './config.js';
export { default as config } from './config.js';

/**
 * Quick start - Create a basic agent
 */
export async function quickStart(task) {
  const { MainAgent } = await import('./agent.js');
  const agent = new MainAgent();
  return await agent.execute(task);
}

/**
 * Create orchestrator with default agents
 */
export async function createOrchestrator() {
  const { OrchestratorAgent } = await import('./orchestrator.js');
  return new OrchestratorAgent();
}

/**
 * Create pipeline with preset
 */
export async function createPipeline(type = 'code') {
  const pipelines = await import('./pipeline.js');

  switch (type) {
    case 'code':
      return pipelines.createCodePipeline();
    case 'content':
      return pipelines.createContentPipeline();
    case 'analysis':
      return pipelines.createAnalysisPipeline();
    default:
      throw new Error(`Unknown pipeline type: ${type}`);
  }
}

/**
 * Create workflow with preset
 */
export async function createWorkflow(type = 'code-review') {
  const { WorkflowAgent, WORKFLOWS } = await import('./workflow.js');
  const agent = new WorkflowAgent();

  if (WORKFLOWS[type]) {
    agent.defineWorkflow(type, WORKFLOWS[type].steps);
  } else {
    throw new Error(`Unknown workflow type: ${type}`);
  }

  return agent;
}
