---
title: Creating Servers
description: How to create new MCP servers in the toolbox
---

Creating new MCP servers is easy with the built-in generator tool.

## Quick Start

Generate a new server:

```bash
bun run create-server my-api-server "API integration server"
```

This creates a complete server package with:
- TypeScript configuration
- Example tool implementation
- Development scripts
- Documentation template

## Basic Server Template

```typescript
import { createMcpServer, createSuccessResponse, createErrorResponse } from '@mcp-toolbox/shared';
import { z } from 'zod';

async function main() {
  const { server, start } = createMcpServer({
    name: 'my-api-server',
    version: '1.0.0',
    description: 'API integration server'
  });

  // Register your tools
  server.tool(
    'my_tool',
    'Description of what this tool does',
    {
      param1: z.string().describe('First parameter'),
      param2: z.number().optional().describe('Optional second parameter')
    },
    async ({ param1, param2 }) => {
      try {
        // Your tool logic here
        const result = await doSomething(param1, param2);
        return createSuccessResponse(result);
      } catch (error) {
        console.error('Error in my_tool:', error);
        return createErrorResponse('Tool execution failed');
      }
    }
  );

  await start();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

## Development Workflow

1. **Create the Server**
   ```bash
   bun run create-server my-server "My server description"
   cd packages/my-server
   ```

2. **Implement Your Tools**
   Edit `src/index.ts` to add your tool implementations.

3. **Test During Development**
   ```bash
   bun run dev  # Hot reload during development
   ```

4. **Build and Test**
   ```bash
   bun run build
   bun run start  # Test the built server
   ```