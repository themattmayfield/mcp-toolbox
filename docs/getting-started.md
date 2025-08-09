# Getting Started with MCP Toolbox

This guide will help you get up and running with the MCP Toolbox monorepo.

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- TypeScript knowledge
- Basic understanding of the [Model Context Protocol](https://modelcontextprotocol.io)

## Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd mcp-toolbox
   bun install
   ```

2. **Build all packages:**
   ```bash
   bun run build
   ```

3. **Verify installation:**
   ```bash
   cd packages/weather-server
   bun run start
   # Should start the weather server
   ```

## Creating Your First MCP Server

### 1. Generate a new server

```bash
bun run create-server my-first-server "My first MCP server"
```

This creates a new package at `packages/my-first-server/` with:
- Complete TypeScript setup
- Example tool implementation
- Development scripts
- Documentation template

### 2. Implement your tools

Edit `packages/my-first-server/src/index.ts`:

```typescript
import { createMcpServer, createSuccessResponse, createErrorResponse } from '@mcp-toolbox/shared';
import { z } from 'zod';

async function main() {
  const { server, start } = createMcpServer({
    name: 'my-first-server',
    version: '1.0.0',
    description: 'My first MCP server'
  });

  // Register your tools
  server.tool(
    'greet',
    'Greet a user by name',
    {
      name: z.string().describe('Name of the person to greet')
    },
    async ({ name }) => {
      try {
        return createSuccessResponse(`Hello, ${name}! Welcome to MCP!`);
      } catch (error) {
        console.error('Error in greet tool:', error);
        return createErrorResponse('Failed to greet user');
      }
    }
  );

  await start();
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
```

### 3. Test your server

```bash
cd packages/my-first-server
bun run dev  # Starts with hot reload
```

### 4. Build and use

```bash
bun run build
```

Add to your Claude Desktop config:
```json
{
  "mcpServers": {
    "my-first-server": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/my-first-server/build/index.js"]
    }
  }
}
```

## Using Shared Utilities

The `@mcp-toolbox/shared` package provides helpful utilities:

### Making HTTP Requests

```typescript
import { makeApiRequest } from '@mcp-toolbox/shared';

const data = await makeApiRequest<MyApiResponse>('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000,
  retries: 3
});
```

### Response Helpers

```typescript
import { createSuccessResponse, createErrorResponse } from '@mcp-toolbox/shared';

// Success response
return createSuccessResponse('Operation completed successfully');

// Error response  
return createErrorResponse('Something went wrong');
```

### Validation Schemas

```typescript
import { CoordinatesSchema, StateCodeSchema } from '@mcp-toolbox/shared';

this.server.tool(
  'get_location_data',
  'Get data for a location',
  CoordinatesSchema, // Use pre-built schema
  async ({ latitude, longitude }) => {
    // Implementation
  }
);
```

## Development Workflow

### Working on Multiple Servers

```bash
# Build all packages
bun run build

# Watch all packages for changes
bun run dev

# Type check everything
bun run typecheck

# Lint all code
bun run lint
```

### Working on a Single Server

```bash
cd packages/my-server

# Development mode with hot reload
bun run dev

# Build just this package
bun run build

# Type check just this package
bun run typecheck
```

### Adding Dependencies

```bash
# Add to a specific package
cd packages/my-server
bun add some-package

# Add to shared utilities
cd packages/shared
bun add some-shared-package

# Add dev dependency to root
bun add -D some-dev-tool
```

## Best Practices

### 1. Use the Server Factory

Always use `createMcpServer` for consistent error handling and setup:

```typescript
async function main() {
  const { server, start } = createMcpServer({
    name: 'my-server',
    version: '1.0.0'
  });
  
  // Register your tools directly
  server.tool(/* ... */);
  
  await start();
}
```

### 2. Handle Errors Gracefully

```typescript
async ({ param }) => {
  try {
    const result = await someAsyncOperation(param);
    return createSuccessResponse(result);
  } catch (error) {
    console.error('Tool error:', error);
    return createErrorResponse('Operation failed');
  }
}
```

### 3. Use Zod for Validation

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120)
});
```

### 4. Add Comprehensive Documentation

- Update your package's README.md
- Document all tools and their parameters
- Include usage examples
- Add Claude Desktop configuration

## Next Steps

- Explore the [weather server example](../packages/weather-server/)
- Read about [shared utilities](../packages/shared/)
- Check out [advanced patterns](./advanced-patterns.md)
- Learn about [testing MCP servers](./testing.md)