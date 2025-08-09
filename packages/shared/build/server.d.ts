import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServerConfig } from "./types.js";
export interface McpServerInstance {
	server: McpServer;
	start: () => Promise<void>;
}
export declare function createMcpServer(
	config: McpServerConfig,
): McpServerInstance;
//# sourceMappingURL=server.d.ts.map
