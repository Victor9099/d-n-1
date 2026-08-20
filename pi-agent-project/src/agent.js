import { Agent } from 'pi-agent-core';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

/**
 * Main Agent Implementation
 * Demonstrates Pi Agent Core capabilities
 */
class MainAgent extends Agent {
  constructor(config = {}) {
    super({
      name: 'MainAgent',
      model: config.model || process.env.AGENT_MODEL || 'gpt-4',
      temperature: config.temperature || parseFloat(process.env.AGENT_TEMPERATURE) || 0.7,
      maxTokens: config.maxTokens || parseInt(process.env.AGENT_MAX_TOKENS) || 4096,
      ...config
    });

    this.initializeTools();
    this.initializeMemory();
  }

  /**
   * Initialize tools for the agent
   */
  initializeTools() {
    // Add custom tools
    this.addTool({
      name: 'calculate',
      description: 'Perform mathematical calculations',
      parameters: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate'
        }
      },
      execute: async ({ expression }) => {
        try {
          // Safe evaluation (only math operations)
          const result = Function(`"use strict"; return (${expression})`)();
          return { result };
        } catch (error) {
          return { error: error.message };
        }
      }
    });

    this.addTool({
      name: 'search_codebase',
      description: 'Search through the codebase',
      parameters: {
        query: {
          type: 'string',
          description: 'Search query'
        },
        file_pattern: {
          type: 'string',
          description: 'File pattern to search in (e.g., *.js)'
        }
      },
      execute: async ({ query, file_pattern }) => {
        // Implement codebase search logic
        return {
          results: [],
          message: `Searching for "${query}" in ${file_pattern || 'all files'}`
        };
      }
    });

    this.addTool({
      name: 'read_file',
      description: 'Read contents of a file',
      parameters: {
        path: {
          type: 'string',
          description: 'File path to read'
        }
      },
      execute: async ({ path }) => {
        try {
          const fs = await import('fs/promises');
          const content = await fs.readFile(path, 'utf-8');
          return { content };
        } catch (error) {
          return { error: error.message };
        }
      }
    });

    this.addTool({
      name: 'write_file',
      description: 'Write content to a file',
      parameters: {
        path: {
          type: 'string',
          description: 'File path to write'
        },
        content: {
          type: 'string',
          description: 'Content to write'
        }
      },
      execute: async ({ path, content }) => {
        try {
          const fs = await import('fs/promises');
          await fs.writeFile(path, content, 'utf-8');
          return { success: true, message: `File written: ${path}` };
        } catch (error) {
          return { error: error.message };
        }
      }
    });
  }

  /**
   * Initialize memory system
   */
  initializeMemory() {
    this.memory = {
      conversations: [],
      facts: new Map(),
      context: {}
    };
  }

  /**
   * Store information in memory
   */
  remember(key, value) {
    this.memory.facts.set(key, value);
  }

  /**
   * Recall information from memory
   */
  recall(key) {
    return this.memory.facts.get(key);
  }

  /**
   * Override the main execution loop
   */
  async execute(task, context = {}) {
    console.log(chalk.blue(`\n🤖 Agent executing: ${task}`));

    try {
      // Add task to conversation history
      this.memory.conversations.push({
        role: 'user',
        content: task,
        timestamp: Date.now()
      });

      // Execute with Pi
      const response = await this.run(task, context);

      // Store response
      this.memory.conversations.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      });

      console.log(chalk.green(`\n✅ Task completed`));
      return response;

    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.memory.conversations;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.memory.conversations = [];
  }
}

/**
 * Main entry point
 */
async function main() {
  console.log(chalk.cyan('╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║      Pi Agent Core - Main Agent        ║'));
  console.log(chalk.cyan('╚════════════════════════════════════════╝\n'));

  // Create agent instance
  const agent = new MainAgent({
    name: 'ProjectAssistant',
    provider: 'openai'
  });

  // Example 1: Simple task
  console.log(chalk.yellow('\n📝 Example 1: Simple Task'));
  const result1 = await agent.execute('What is 2 + 2?');
  console.log(result1);

  // Example 2: Code generation
  console.log(chalk.yellow('\n📝 Example 2: Code Generation'));
  const result2 = await agent.execute(`
    Create a simple Express.js server with:
    - GET /health endpoint
    - POST /api/data endpoint
    - Error handling middleware
  `);
  console.log(result2);

  // Example 3: Use tools
  console.log(chalk.yellow('\n📝 Example 3: Using Tools'));
  const result3 = await agent.execute(`
    Use the calculate tool to compute: 15 * 23 + 47
  `);
  console.log(result3);

  // Interactive mode
  console.log(chalk.yellow('\n📝 Interactive Mode'));
  console.log(chalk.gray('Type your tasks (Ctrl+C to exit)\n'));

  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const prompt = () => {
    rl.question(chalk.cyan('You: '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log(chalk.green('\nGoodbye! 👋'));
        rl.close();
        process.exit(0);
      }

      try {
        const response = await agent.execute(input);
        console.log(chalk.green(`\nAgent: ${response}\n`));
      } catch (error) {
        console.error(chalk.red(`Error: ${error.message}\n`));
      }

      prompt();
    });
  };

  prompt();
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MainAgent };
export default MainAgent;
