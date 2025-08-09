---
title: Quick Start
description: Get up and running with MCP Toolbox servers
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

Install any MCP server from the toolbox using the pattern:

```bash
npm install -g @mcp-toolbox/{server-name}
```

For example:
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
    "unleash": {
      "command": "unleash-server-mcp-server"
    }
  }
}
```

## Next Steps

1. Restart your MCP client
2. Start using the server's tools in your conversations
3. Check the individual server documentation for detailed usage instructions