---
title: Getting Started
description: How to set up and use MCP Toolbox
---

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- An MCP-compatible client:
  - [OpenCode](https://opencode.ai) - AI-powered development environment
  - [Claude Desktop](https://claude.ai/desktop) - Anthropic's desktop application
  - [Claude Code](https://github.com/anthropics/claude-code) - Anthropic's CLI for Claude
  - [Cursor](https://cursor.sh) - AI-powered code editor

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mcp-toolbox
   cd mcp-toolbox
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Build all servers:**
   ```bash
   bun run build
   ```

## Configure Your MCP Client

### Claude Desktop

Add servers to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/weather-server/build/index.js"]
    },
    "unleash": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/unleash-server/build/index.js"]
    }
  }
}
```

### Other MCP Clients

For OpenCode, Claude Code, Cursor, and other MCP-compatible clients, refer to their specific documentation for MCP server configuration. The server command and arguments remain the same:

- **Command:** `node`
- **Arguments:** `["/path/to/mcp-toolbox/packages/[server-name]/build/index.js"]`

## Test Your Setup

1. Restart your MCP client (Claude Desktop, OpenCode, etc.)
2. Start a new conversation or session
3. Try asking: "What's the weather in San Francisco?"

The weather server should respond with current weather information.