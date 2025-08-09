# MCP Toolbox

A well-organized monorepo for building and managing Model Context Protocol (MCP) servers.

## 🏗️ Architecture

```
mcp-toolbox/
├── packages/
│   ├── shared/           # Common utilities and types
│   ├── weather-server/   # Weather data MCP server
│   └── [your-servers]/   # Your custom MCP servers
├── tools/               # Development and build tools
├── docs/               # Documentation
└── package.json        # Workspace configuration
```

## 🚀 Quick Start

### Install Dependencies
```bash
bun install
```

### Build All Packages
```bash
bun run build
```

### Create a New MCP Server
```bash
bun run create-server my-api-server "My API integration server"
```

### Development Mode
```bash
# Build and watch all packages
bun run dev

# Work on a specific package
cd packages/weather-server
bun run dev
```

## 📦 Available Servers

### Weather Server
Get weather data using the National Weather Service API.

```bash
cd packages/weather-server
bun run build
bun run start
```

**Tools:**
- `get_alerts` - Get weather alerts for US states
- `get_forecast` - Get weather forecasts for coordinates

## 🛠️ Development

### Creating New Servers

Use the built-in generator to create new MCP servers:

```bash
bun run create-server <name> [description] [version]
```

This creates a new server with:
- ✅ TypeScript configuration
- ✅ Shared utilities integration
- ✅ Development scripts
- ✅ Documentation template
- ✅ Example tool implementation

### Shared Utilities

All servers can use the `@mcp-toolbox/shared` package which provides:

- **Base Server Class**: Common MCP server functionality
- **HTTP Utilities**: Request handling with retries and timeouts
- **Response Helpers**: Standardized success/error responses
- **Type Definitions**: Shared TypeScript types and Zod schemas
- **Validation**: Common validation helpers

```typescript
import { BaseMcpServer, createSuccessResponse, makeApiRequest } from '@mcp-toolbox/shared';
```

### Scripts

```bash
# Build all packages
bun run build

# Start development mode (watch all packages)
bun run dev

# Run type checking
bun run typecheck

# Lint code
bun run lint
bun run lint:fix

# Clean build artifacts
bun run clean

# Run tests
bun run test
```

## 🔧 Configuration

### Claude Desktop Integration

Add your servers to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/weather-server/build/index.js"]
    },
    "my-server": {
      "command": "node", 
      "args": ["/path/to/mcp-toolbox/packages/my-server/build/index.js"]
    }
  }
}
```

### TypeScript Configuration

The monorepo uses TypeScript project references for:
- ⚡ Fast incremental builds
- 🔗 Proper dependency resolution
- 📝 Cross-package type checking

## 📁 Package Structure

Each MCP server package follows this structure:

```
packages/my-server/
├── src/
│   └── index.ts         # Main server implementation
├── build/               # Compiled output
├── package.json         # Package configuration
├── tsconfig.json        # TypeScript config
└── README.md           # Package documentation
```

## 🤝 Contributing

1. Create a new server: `bun run create-server my-feature`
2. Implement your tools in `packages/my-feature/src/index.ts`
3. Add tests and documentation
4. Build and test: `bun run build && bun run typecheck`

## 📄 License

MIT# mcp-toolbox
