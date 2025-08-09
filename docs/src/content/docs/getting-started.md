---
title: Getting Started
description: How to set up and use MCP Toolbox
---

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- [Claude Desktop](https://claude.ai/desktop)

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

## Configure Claude Desktop

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

## Test Your Setup

1. Restart Claude Desktop
2. Start a new conversation
3. Try asking: "What's the weather in San Francisco?"

The weather server should respond with current weather information.