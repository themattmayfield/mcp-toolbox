# Architecture Overview

The MCP Toolbox is designed as a scalable monorepo that makes it easy to create, maintain, and share MCP servers.

## Design Principles

### 1. **Modularity**
Each MCP server is a separate package with its own dependencies and build process, while sharing common utilities.

### 2. **Consistency** 
All servers follow the same structure and patterns, making them easy to understand and maintain.

### 3. **Reusability**
Common functionality is extracted into shared utilities to avoid duplication.

### 4. **Developer Experience**
Tools and scripts make it easy to create new servers and manage the monorepo.

## Monorepo Structure

```
mcp-toolbox/
├── packages/                    # All MCP server packages
│   ├── shared/                 # Shared utilities and types
│   │   ├── src/
│   │   │   ├── types.ts       # Common TypeScript types
│   │   │   ├── utils.ts       # Utility functions
│   │   │   ├── server-base.ts # Base server class
│   │   │   └── index.ts       # Package exports
│   │   ├── build/             # Compiled output
│   │   └── package.json
│   │
│   ├── weather-server/         # Example weather server
│   │   ├── src/
│   │   │   └── index.ts       # Server implementation
│   │   ├── build/             # Compiled output
│   │   └── package.json
│   │
│   └── [other-servers]/        # Additional MCP servers
│
├── tools/                      # Development tools
│   └── create-server.ts       # Server generator script
│
├── docs/                       # Documentation
│   ├── getting-started.md
│   ├── architecture.md
│   └── [other-docs]/
│
├── package.json               # Root workspace configuration
├── tsconfig.json             # Root TypeScript configuration
├── biome.json               # Code formatting/linting
└── README.md               # Main documentation
```

## Package Architecture

### Shared Package (`@mcp-toolbox/shared`)

The shared package provides common functionality used across all MCP servers:

#### Base Server Class
```typescript
abstract class BaseMcpServer {
  protected server: McpServer;
  protected config: McpServerConfig;
  
  constructor(config: McpServerConfig);
  protected abstract registerTools(): void;
  async start(): Promise<void>;
}
```

**Features:**
- Automatic error handling and graceful shutdown
- Consistent server setup and configuration
- Signal handling (SIGINT, SIGTERM)
- Transport management

#### Utility Functions
```typescript
// HTTP requests with retry logic
makeApiRequest<T>(url: string, options?: ApiRequestOptions): Promise<T | null>

// Response formatting
createSuccessResponse(text: string): McpToolResponse
createErrorResponse(message: string): McpToolResponse

// Validation helpers
formatCoordinates(lat: number, lon: number): string
validateStateCode(state: string): string
```

#### Type Definitions
- `McpToolResponse` - Standard response format
- `McpServerConfig` - Server configuration
- `Coordinates` - Latitude/longitude validation
- `StateCode` - US state code validation

### Individual Server Packages

Each MCP server follows this structure:

```typescript
class MyServer extends BaseMcpServer {
  constructor() {
    super({
      name: 'my-server',
      version: '1.0.0',
      description: 'Server description'
    });
  }

  protected registerTools(): void {
    this.server.tool(
      'tool_name',
      'Tool description',
      { /* Zod schema */ },
      async (params) => {
        // Tool implementation
      }
    );
  }
}
```

## Build System

### TypeScript Project References

The monorepo uses TypeScript project references for:
- **Fast incremental builds** - Only rebuild changed packages
- **Proper dependency resolution** - Type-safe imports between packages
- **Parallel compilation** - Build multiple packages simultaneously

```json
// Root tsconfig.json
{
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/weather-server" }
  ]
}
```

### Workspace Configuration

Bun workspaces manage dependencies and scripts:

```json
{
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "bun run --filter='*' build",
    "dev": "bun run --filter='*' dev"
  }
}
```

## Development Tools

### Server Generator (`tools/create-server.ts`)

Automatically creates new MCP servers with:
- Complete package structure
- TypeScript configuration
- Example tool implementation
- Documentation template
- Development scripts

Usage:
```bash
bun run create-server my-api-server "API integration server"
```

### Development Scripts

```bash
# Build all packages
bun run build

# Watch mode for all packages  
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint
```

## Dependency Management

### Shared Dependencies
Common dependencies are managed at the workspace level:
- `@modelcontextprotocol/sdk` - MCP SDK
- `zod` - Schema validation
- `typescript` - TypeScript compiler

### Package-Specific Dependencies
Each server can add its own dependencies:
```bash
cd packages/my-server
bun add axios  # Only available in this package
```

### Internal Dependencies
Packages reference each other using workspace protocol:
```json
{
  "dependencies": {
    "@mcp-toolbox/shared": "workspace:*"
  }
}
```

## Error Handling Strategy

### Server Level
- Graceful shutdown on SIGINT/SIGTERM
- Uncaught exception handling
- Transport error handling

### Tool Level
- Try-catch blocks around tool logic
- Standardized error responses
- Detailed error logging

### HTTP Level
- Retry logic with exponential backoff
- Timeout handling
- Status code validation

## Scalability Considerations

### Adding New Servers
1. Use the generator: `bun run create-server`
2. Implement tools using shared utilities
3. Add to TypeScript references
4. Document in README

### Shared Functionality
- Add common utilities to `packages/shared`
- Export from `packages/shared/src/index.ts`
- Update documentation

### Performance
- TypeScript project references enable incremental builds
- Workspace scripts run in parallel where possible
- Each server is independently deployable

## Security Best Practices

### Input Validation
- Use Zod schemas for all tool parameters
- Validate external API responses
- Sanitize user inputs

### Error Information
- Don't expose internal errors to users
- Log detailed errors server-side
- Return generic error messages

### Dependencies
- Regular dependency updates
- Security scanning
- Minimal dependency footprint

## Testing Strategy

### Unit Tests
- Test individual utility functions
- Mock external API calls
- Validate schema parsing

### Integration Tests  
- Test complete tool workflows
- Validate MCP protocol compliance
- Test error scenarios

### End-to-End Tests
- Test with actual Claude Desktop
- Validate tool responses
- Performance testing