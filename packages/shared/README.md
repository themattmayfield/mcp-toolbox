# Shared MCP Utilities

Common utilities, types, and server factory for MCP servers in the toolbox.

## Features

- **Server Factory**: Simple function to create MCP servers with error handling
- **Utility Functions**: HTTP requests, response formatting, validation helpers
- **Type Definitions**: Shared TypeScript types and Zod schemas
- **Error Handling**: Standardized error handling and graceful shutdown

## Usage

```typescript
import { createMcpServer, createSuccessResponse, makeApiRequest } from '@mcp-toolbox/shared';
import { z } from 'zod';

async function main() {
  const { server, start } = createMcpServer({
    name: 'my-server',
    version: '1.0.0',
    description: 'My custom MCP server'
  });

  // Register tools directly on the server
  server.tool(
    'my_tool',
    'Description of my tool',
    { message: z.string() },
    async ({ message }) => {
      const data = await makeApiRequest('https://api.example.com/data');
      return createSuccessResponse(`Processed: ${message}`);
    }
  );

  await start();
}

main().catch(console.error);
```

## API Reference

### Server Factory
- `createMcpServer(config)` - Create MCP server with error handling
- Returns `{ server, start }` - Server instance and start function

### Types
- `McpToolResponse` - Standard MCP tool response format
- `McpServerConfig` - Server configuration interface
- `McpServerInstance` - Server factory return type
- `Coordinates` - Latitude/longitude coordinates
- `StateCode` - US state code validation

### Utilities
- `makeApiRequest<T>()` - HTTP request with retry logic
- `createSuccessResponse()` - Create success response
- `createErrorResponse()` - Create error response
- `formatCoordinates()` - Format lat/lon coordinates
- `validateStateCode()` - Validate US state codes