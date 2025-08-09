---
title: Getting Started
description: How to set up and use MCP Toolbox servers
---

## Prerequisites

- Node.js 18+ (for NPM installation)
- An MCP-compatible client:
  - [Claude Desktop](https://claude.ai/desktop) - Anthropic's desktop application
  - [Cursor](https://cursor.sh) - AI-powered code editor
  - [opencode](https://opencode.ai) - AI-powered development environment
  - [Windsurf](https://codeium.com/windsurf) - AI-powered IDE
  - [Claude Code](https://github.com/anthropics/claude-code) - Anthropic's CLI for Claude

## Installation

Install the MCP servers you want to use:

### Weather Server
```bash
npm install -g @mcp-toolbox/weather-server
```

### Unleash Server
```bash
npm install -g @mcp-toolbox/unleash-server
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
      "command": "weather-mcp-server"
    },
    "unleash": {
      "command": "unleash-server-mcp-server"
    }
  }
}
```

### Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    },
    "unleash": {
      "command": "unleash-server-mcp-server"
    }
  }
}
```

### opencode

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    },
    "unleash": {
      "command": "unleash-server-mcp-server"
    }
  }
}
```

### Windsurf

Configure in your MCP settings:

```json
{
  "mcpServers": {
    "weather": {
      "command": "weather-mcp-server"
    },
    "unleash": {
      "command": "unleash-server-mcp-server"
    }
  }
}
```

### Other MCP Clients

For any MCP-compatible client, use the command names:
- **Weather Server:** `weather-mcp-server`
- **Unleash Server:** `unleash-server-mcp-server`

## Setup Unleash Server (if using)

If you installed the Unleash server, run the interactive setup:

```bash
unleash-server-setup
```

This will guide you through connecting to your Unleash instances.

## Test Your Setup

1. Restart your MCP client (Claude Desktop, OpenCode, etc.)
2. Start a new conversation or session
3. Try asking: "What's the weather in San Francisco?"

The weather server should respond with current weather information.

## Available Servers

### Weather Server
- Get weather alerts for US states
- Get detailed forecasts for any location
- Uses National Weather Service API

### Unleash Server  
- Manage feature flags across environments
- Support for multiple Unleash instances
- Create, toggle, and archive feature flags

## Need Help?

Check the individual server documentation:
- [Weather Server](/docs/servers/weather)
- [Unleash Server](/docs/servers/unleash)