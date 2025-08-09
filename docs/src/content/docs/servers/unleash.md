---
title: Unleash Server
description: The Unleash Server lets you manage feature flags across multiple Unleash instances and environments directly from your MCP-compatible client. Perfect for controlling feature rollouts, A/B testing, and managing deployments across different environments.
---

**Name:** Unleash MCP Server

## Description

The Unleash Server lets you manage feature flags across multiple Unleash instances and environments directly from your MCP-compatible client. Perfect for controlling feature rollouts, A/B testing, and managing deployments across different environments.

## Key Concepts

**Instances vs Environments**: 
- **Instances** are separate Unleash servers (e.g., production, staging, development)
- **Environments** are deployment targets within an instance (e.g., dev, staging, prod)
- Each feature flag can be enabled/disabled independently in each environment

## Quick Setup

### 1. Interactive Setup (Recommended)

Run the setup wizard to configure your Unleash instances:

```bash
cd packages/unleash-server
bun run setup
```

The wizard will:
- Test your connection to each Unleash instance
- Help you select which environments to work with
- Generate the configuration automatically
- Show you how to add it to Claude Desktop

### 2. Add to Your MCP Client

#### Claude Desktop

Add to your `claude_desktop_config.json`:

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

#### Cursor

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

#### opencode

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

#### Windsurf

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

#### Other MCP Clients

For any MCP-compatible client, use:
- **Command:** `unleash-server-mcp-server`
- **Arguments:** None required
- **Setup Command:** `unleash-server-setup` (for initial configuration)

## Available Tools

#### `list_instances`
**What it does:** Shows all your configured Unleash servers

**When to use:** 
- First time using the server to see what's available
- When you forget the exact name of an instance

#### `list_features`
**What it does:** Lists feature flags and their current status across environments

**When to use:** 
- See what features exist and their current status
- Main tool for viewing features in your Unleash instance

#### `create_feature`
**What it does:** Creates a new feature flag

**When to use:** 
- Adding new features that need controlled rollout
- Setting up A/B tests or experiments

#### `toggle_feature`
**What it does:** Enables or disables a feature in a specific environment

**When to use:** 
- Rolling out features to different environments
- Turning off features that are causing issues

#### `get_feature_status`
**What it does:** Gets detailed information about a specific feature flag

**When to use:** 
- Need comprehensive details about one particular feature
- Checking the configuration and status of a feature

#### `archive_feature`
**What it does:** Archives (soft deletes) a feature flag

**When to use:** 
- Feature is no longer needed but you want to keep history
- Cleaning up old features without permanently deleting them

#### `list_environments`
**What it does:** Shows available environments for an Unleash instance

**When to use:** 
- See what environments you can deploy features to
- Understanding your deployment pipeline structure

#### `list_all_features`
**What it does:** Provides a global view of all features across environments

**When to use:** 
- Advanced use cases requiring global feature overview
- Most of the time you'll want `list_features` instead

