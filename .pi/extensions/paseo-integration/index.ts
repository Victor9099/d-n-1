/**
 * Pi Extension: Paseo Integration
 * 
 * Allows Pi to be controlled by Paseo CLI
 * Registers Pi as a provider for Paseo daemon
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { spawn, ChildProcess } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

// Paseo daemon connection
const PASEO_DAEMON_URL = process.env.PASEO_DAEMON_URL || "http://127.0.0.1:6767";

interface PaseoAgentConfig {
  id: string;
  task: string;
  mode: string;
  model: string;
  cwd: string;
}

class PaseoIntegration {
  private agentProcess: ChildProcess | null = null;
  private agentId: string | null = null;

  /**
   * Register Pi as a Paseo provider
   */
  async registerProvider(): Promise<void> {
    const providerConfig = {
      id: "pi",
      label: "Pi Coding Agent",
      description: "Advanced AI coding agent with multi-agent orchestration",
      enabledByDefault: true,
      defaultModeId: "default",
      modes: [
        {
          id: "default",
          label: "Default Mode",
          description: "Standard Pi agent with full tool access",
          icon: "Sparkles",
          colorTier: "safe"
        },
        {
          id: "auto",
          label: "Auto Mode",
          description: "Automatic tool execution without prompts",
          icon: "Zap",
          colorTier: "moderate",
          isUnattended: true
        },
        {
          id: "multi-agent",
          label: "Multi-Agent Mode",
          description: "Full hierarchy: Supervisor → Lead → Peer → Workers",
          icon: "Users",
          colorTier: "moderate"
        }
      ]
    };

    // Write provider config to Paseo home
    const paseoHome = process.env.PASEO_HOME || join(process.env.HOME || process.env.USERPROFILE || "~", ".paseo");
    const providersDir = join(paseoHome, "providers");
    const providerPath = join(providersDir, "pi.json");

    try {
      // Create providers directory if not exists
      if (!existsSync(providersDir)) {
        const { mkdirSync } = await import("fs");
        mkdirSync(providersDir, { recursive: true });
      }

      writeFileSync(providerPath, JSON.stringify(providerConfig, null, 2));
      console.log(`✅ Pi provider registered at: ${providerPath}`);
    } catch (error) {
      console.error("❌ Failed to register Pi provider:", error);
      throw error;
    }
  }

  /**
   * Launch Pi agent via Paseo
   */
  async launchAgent(config: PaseoAgentConfig): Promise<string> {
    const { task, mode, model, cwd } = config;

    console.log(`🚀 Launching Pi agent: ${task}`);

    // Build Pi command
    const args = ["--model", model];
    
    if (mode === "auto") {
      args.push("--auto");
    } else if (mode === "multi-agent") {
      // Multi-agent mode will be handled by Pi's internal orchestration
      args.push("--multi-agent");
    }

    // Spawn Pi process
    this.agentProcess = spawn("pi", args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env }
    });

    this.agentId = `pi-${Date.now()}`;

    // Stream output
    this.agentProcess.stdout?.on("data", (data) => {
      console.log(`[Pi ${this.agentId}] ${data}`);
    });

    this.agentProcess.stderr?.on("data", (data) => {
      console.error(`[Pi ${this.agentId} Error] ${data}`);
    });

    return this.agentId;
  }

  /**
   * Send message to running Pi agent
   */
  async sendMessage(agentId: string, message: string): Promise<void> {
    if (!this.agentProcess || this.agentId !== agentId) {
      throw new Error(`Agent ${agentId} not found or not running`);
    }

    this.agentProcess.stdin?.write(message + "\n");
  }

  /**
   * Stop Pi agent
   */
  async stopAgent(agentId: string): Promise<void> {
    if (this.agentProcess && this.agentId === agentId) {
      this.agentProcess.kill("SIGTERM");
      this.agentProcess = null;
      this.agentId = null;
    }
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentId: string): Promise<{
    running: boolean;
    pid?: number;
    agentId: string;
  }> {
    return {
      running: this.agentProcess !== null && this.agentId === agentId,
      pid: this.agentProcess?.pid,
      agentId
    };
  }
}

/**
 * Pi Extension Entry Point
 */
export default async function (pi: ExtensionAPI) {
  const integration = new PaseoIntegration();

  // Register Pi provider with Paseo on extension load
  try {
    await integration.registerProvider();
    console.log("✅ Paseo integration initialized");
  } catch (error) {
    console.error("❌ Failed to initialize Paseo integration:", error);
  }

  // Register custom tools for Paseo integration
  pi.registerTool("paseo_launch", {
    description: "Launch a Pi agent via Paseo",
    parameters: {
      task: { type: "string", description: "Task to execute" },
      mode: { type: "string", enum: ["default", "auto", "multi-agent"], default: "default" },
      model: { type: "string", default: "claude-sonnet-4" }
    },
    async execute({ task, mode, model }) {
      const agentId = await integration.launchAgent({
        id: `pi-${Date.now()}`,
        task,
        mode: mode || "default",
        model: model || "claude-sonnet-4",
        cwd: process.cwd()
      });

      return { agentId, status: "launched" };
    }
  });

  pi.registerTool("paseo_send", {
    description: "Send message to running Pi agent",
    parameters: {
      agentId: { type: "string", description: "Agent ID" },
      message: { type: "string", description: "Message to send" }
    },
    async execute({ agentId, message }) {
      await integration.sendMessage(agentId, message);
      return { status: "sent" };
    }
  });

  pi.registerTool("paseo_stop", {
    description: "Stop running Pi agent",
    parameters: {
      agentId: { type: "string", description: "Agent ID" }
    },
    async execute({ agentId }) {
      await integration.stopAgent(agentId);
      return { status: "stopped" };
    }
  });

  pi.registerTool("paseo_status", {
    description: "Get Pi agent status",
    parameters: {
      agentId: { type: "string", description: "Agent ID" }
    },
    async execute({ agentId }) {
      return await integration.getAgentStatus(agentId);
    }
  });

  // Hook into session events
  pi.on("session_start", async (event, ctx) => {
    console.log("🚀 Pi session started");
    
    // Check if launched by Paseo
    if (process.env.PASEO_AGENT_ID) {
      console.log(`📍 Running under Paseo agent: ${process.env.PASEO_AGENT_ID}`);
    }
  });

  pi.on("session_end", async (event, ctx) => {
    console.log("🛑 Pi session ended");
  });
}
