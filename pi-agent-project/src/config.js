import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

/**
 * Configuration Manager
 * Centralized configuration for Pi Agent Core
 */
class Config {
  constructor() {
    this.config = {
      // Providers
      providers: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY,
          baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
          defaultModel: process.env.OPENAI_MODEL || 'gpt-4'
        },
        anthropic: {
          apiKey: process.env.ANTHROPIC_API_KEY,
          defaultModel: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229'
        },
        google: {
          apiKey: process.env.GOOGLE_API_KEY,
          defaultModel: process.env.GOOGLE_MODEL || 'gemini-pro'
        },
        aibox: {
          apiKey: process.env.AIBOX_API_KEY,
          baseUrl: process.env.AIBOX_BASE_URL || 'https://api.ai-box.vn/v1',
          defaultModel: process.env.AIBOX_MODEL || 'deepseek-v4-pro-0813'
        }
      },

      // Agent defaults
      agent: {
        defaultProvider: process.env.AGENT_PROVIDER || 'openai',
        defaultModel: process.env.AGENT_MODEL || 'gpt-4',
        temperature: parseFloat(process.env.AGENT_TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.AGENT_MAX_TOKENS) || 4096
      },

      // Logging
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'json'
      }
    };

    this.validate();
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];

    // Check required API keys
    if (!this.config.providers.openai.apiKey) {
      errors.push('OPENAI_API_KEY is required');
    }

    if (errors.length > 0) {
      console.warn(chalk.yellow('\n⚠️  Configuration warnings:'));
      errors.forEach(err => console.warn(chalk.yellow(`   - ${err}`)));
      console.warn();
    }
  }

  /**
   * Get provider configuration
   */
  getProvider(name) {
    return this.config.providers[name];
  }

  /**
   * Get agent configuration
   */
  getAgentConfig() {
    return this.config.agent;
  }

  /**
   * Update configuration
   */
  update(key, value) {
    const keys = key.split('.');
    let current = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Export configuration
   */
  export() {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Display configuration
   */
  display() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════╗'));
    console.log(chalk.cyan('║      Pi Agent Core Configuration       ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════╝\n'));

    console.log(chalk.yellow('Providers:'));
    Object.entries(this.config.providers).forEach(([name, config]) => {
      const hasKey = config.apiKey ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${hasKey} ${name}`);
      if (config.baseUrl) {
        console.log(`    Base URL: ${config.baseUrl}`);
      }
      console.log(`    Model: ${config.defaultModel}`);
    });

    console.log(chalk.yellow('\nAgent Defaults:'));
    console.log(`  Provider: ${this.config.agent.defaultProvider}`);
    console.log(`  Model: ${this.config.agent.defaultModel}`);
    console.log(`  Temperature: ${this.config.agent.temperature}`);
    console.log(`  Max Tokens: ${this.config.agent.maxTokens}`);

    console.log(chalk.yellow('\nLogging:'));
    console.log(`  Level: ${this.config.logging.level}`);
    console.log(`  Format: ${this.config.logging.format}`);
    console.log();
  }
}

// Create singleton instance
const config = new Config();

export { Config };
export default config;
