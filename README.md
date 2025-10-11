# MCP Toolbox

A well-organized monorepo for building and managing Model Context Protocol (MCP) servers.

## 🔧 Configuration

### MCP Client Integration

#### opencode

```json
{
  "mcpServers": {
    "server": {
      "type": "local",
      "command": ["node", "/path/to/mcp-toolbox/packages/server/build/index.js"],
      "enabled": true
    }
  }
}
```

#### Claude Desktop, Cursor, Windsurf, and agents

```json
{
  "mcpServers": {
    "server": {
      "command": "node", 
      "args": ["/path/to/mcp-toolbox/packages/server/build/index.js"]
    }
  }
}
```
