---
title: Shared Utilities
description: Common utilities and helpers for MCP servers
---

The `@mcp-toolbox/shared` package provides common functionality used across all MCP servers.

## Server Factory

### createMcpServer

Creates a configured MCP server with consistent error handling:

```typescript
import { createMcpServer } from '@mcp-toolbox/shared';

const { server, start } = createMcpServer({
  name: 'my-server',
  version: '1.0.0',
  description: 'Server description'
});

// Register tools
server.tool(/* ... */);

// Start the server
await start();
```

## HTTP Utilities

### makeApiRequest

Make HTTP requests with retry logic and error handling:

```typescript
import { makeApiRequest } from '@mcp-toolbox/shared';

const data = await makeApiRequest<MyApiResponse>('https://api.example.com/data', {
  method: 'GET',
  headers: { 
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  timeout: 5000,
  retries: 3
});
```

## Response Helpers

### createSuccessResponse

Create standardized success responses:

```typescript
import { createSuccessResponse } from '@mcp-toolbox/shared';

return createSuccessResponse('Operation completed successfully');
```

### createErrorResponse

Create standardized error responses:

```typescript
import { createErrorResponse } from '@mcp-toolbox/shared';

return createErrorResponse('Something went wrong');
```

## Validation Schemas

Pre-built Zod schemas for common data types:

### CoordinatesSchema

Validates latitude and longitude:

```typescript
import { CoordinatesSchema } from '@mcp-toolbox/shared';

server.tool(
  'get_location_data',
  'Get data for coordinates',
  CoordinatesSchema,
  async ({ latitude, longitude }) => {
    // latitude: number (-90 to 90)
    // longitude: number (-180 to 180)
  }
);
```