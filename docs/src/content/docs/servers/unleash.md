---
title: Unleash Server
description: Manage Unleash feature flags from Claude Desktop
---

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

### 2. Manual Configuration

Alternatively, set environment variables:

```bash
export UNLEASH_URL=https://your-unleash.com
export UNLEASH_TOKEN=your-admin-token
export UNLEASH_PROJECT=default
```

### 3. Add to Your MCP Client

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

### list_instances
**Purpose**: Show all configured Unleash instances  
**When to use**: Start here to see what instances are available

```
list_instances
```

**Example output**:
```
Available Unleash instances:

**production**
  URL: https://unleash.company.com
  Default Project: default

**staging**
  URL: https://staging-unleash.company.com
  Default Project: default
```

### list_features
**Purpose**: List feature flags (main tool for viewing features)  
**When to use**: See what features exist and their current status

**Parameters:**
- `instance` (required): Which Unleash instance to query
- `project` (optional): Filter by project name
- `environment` (optional): Show status for specific environment

```
list_features instance="production"
list_features instance="staging" environment="development"
```

**Example output**:
```
Feature flags in production (default project):

Found 3 feature flag(s):
- Active: 2
- Disabled: 1
- Archived: 0
- Stale: 0

**new-checkout-flow** (release) ✅ ENABLED
Description: New streamlined checkout process
Project: default
Environments: development: ✅, staging: ✅, production: ❌
Created: 12/15/2023
---

**dark-mode** (release) ❌ DISABLED
Project: default
Environments: development: ✅, staging: ❌, production: ❌
Created: 12/10/2023
---
```

### create_feature
**Purpose**: Create a new feature flag  
**When to use**: Adding new features that need controlled rollout

**Parameters:**
- `instance` (required): Which Unleash instance
- `name` (required): Feature flag name
- `description` (optional): What this feature does
- `type` (optional): Type of flag (release, experiment, operational, kill-switch, permission)
- `project` (optional): Project name (uses instance default if not specified)

```
create_feature instance="staging" name="new-payment-method" description="Support for Apple Pay"
create_feature instance="production" name="emergency-maintenance" type="kill-switch"
```

**What happens**: Creates the feature and automatically disables it in all environments for safety.

### toggle_feature
**Purpose**: Enable or disable a feature in a specific environment  
**When to use**: Rolling out features or turning them off

**Parameters:**
- `instance` (required): Which Unleash instance
- `name` (required): Feature flag name
- `environment` (required): Which environment to change
- `enabled` (required): true to enable, false to disable
- `project` (optional): Project name

```
toggle_feature instance="staging" name="new-checkout-flow" environment="development" enabled=true
toggle_feature instance="production" name="dark-mode" environment="production" enabled=false
```

### get_feature_status
**Purpose**: Get detailed information about a specific feature  
**When to use**: Need comprehensive details about one feature

**Parameters:**
- `instance` (required): Which Unleash instance
- `name` (required): Feature flag name
- `project` (optional): Project name
- `environment` (optional): Show detailed environment info

```
get_feature_status instance="production" name="new-checkout-flow"
get_feature_status instance="staging" name="dark-mode" environment="development"
```

### archive_feature
**Purpose**: Archive (soft delete) a feature flag  
**When to use**: Feature is no longer needed but you want to keep history

**Parameters:**
- `instance` (required): Which Unleash instance
- `name` (required): Feature flag name
- `project` (optional): Project name

```
archive_feature instance="production" name="old-legacy-feature"
```

**Note**: Archived features are hidden but can be restored if needed.

### list_environments
**Purpose**: Show available environments for an instance  
**When to use**: See what environments you can deploy to

**Parameters:**
- `instance` (required): Which Unleash instance
- `project` (optional): Project name

```
list_environments instance="production"
```

**Example output**:
```
Environments in production (default project):

**development** (development)
  Status: ✅ Enabled
  Protected: 🔓 No

**staging** (production)
  Status: ✅ Enabled
  Protected: 🔒 Yes

**production** (production)
  Status: ✅ Enabled
  Protected: 🔒 Yes
```

### list_all_features
**Purpose**: Global view of all features across environments  
**When to use**: Advanced use - need to see global feature status (rarely needed)

**Parameters:**
- `instance` (required): Which Unleash instance
- `project` (optional): Project name

```
list_all_features instance="production"
```

**Note**: Most of the time you want `list_features` instead, which shows environment-specific status.

