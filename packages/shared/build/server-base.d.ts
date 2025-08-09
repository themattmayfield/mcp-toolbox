import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServerConfig } from "./types.js";
export declare abstract class BaseMcpServer {
	server: McpServer;
	protected config: McpServerConfig;
	constructor(config: McpServerConfig);
	protected abstract registerTools(): void;
	private setupErrorHandling;
	start(): Promise<void>;
}
//# sourceMappingURL=server-base.d.ts.map
