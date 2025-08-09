import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
export function createMcpServer(config) {
    const server = new McpServer({
        name: config.name,
        version: config.version,
    });
    const setupErrorHandling = (serverInstance) => {
        process.on("SIGINT", async () => {
            console.error("Received SIGINT, shutting down gracefully...");
            await serverInstance.close();
            process.exit(0);
        });
        process.on("SIGTERM", async () => {
            console.error("Received SIGTERM, shutting down gracefully...");
            await serverInstance.close();
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
    };
    const start = async () => {
        setupErrorHandling(server);
        const transport = new StdioServerTransport();
        transport.onclose = () => {
            console.error("Transport closed");
        };
        transport.onerror = (error) => {
            console.error("Transport error:", error);
        };
        try {
            await server.connect(transport);
            console.error(`${config.name} MCP Server running on stdio`);
        }
        catch (error) {
            console.error("Failed to connect server:", error);
            process.exit(1);
        }
    };
    return { server, start };
}
//# sourceMappingURL=server.js.map