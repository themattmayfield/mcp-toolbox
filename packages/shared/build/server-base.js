import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
export class BaseMcpServer {
	server;
	config;
	constructor(config) {
		this.config = config;
		this.server = new McpServer({
			name: config.name,
			version: config.version,
		});
		this.setupErrorHandling();
	}
	setupErrorHandling() {
		process.on("SIGINT", async () => {
			console.error("Received SIGINT, shutting down gracefully...");
			await this.server.close();
			process.exit(0);
		});
		process.on("SIGTERM", async () => {
			console.error("Received SIGTERM, shutting down gracefully...");
			await this.server.close();
			process.exit(0);
		});
		process.on("uncaughtException", (error) => {
			console.error("Uncaught exception:", error);
			process.exit(1);
		});
		process.on("unhandledRejection", (reason, promise) => {
			console.error("Unhandled rejection at:", promise, "reason:", reason);
			process.exit(1);
		});
	}
	async start() {
		this.registerTools();
		const transport = new StdioServerTransport();
		transport.onclose = () => {
			console.error("Transport closed");
		};
		transport.onerror = (error) => {
			console.error("Transport error:", error);
		};
		try {
			await this.server.connect(transport);
			console.error(`${this.config.name} MCP Server running on stdio`);
		} catch (error) {
			console.error("Failed to connect server:", error);
			process.exit(1);
		}
	}
}
//# sourceMappingURL=server-base.js.map
