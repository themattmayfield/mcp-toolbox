# Unleash MCP Server

A Model Context Protocol server for managing Unleash feature flags across multiple instances and environments.

## Features

- ✅ **Multiple Instance Support** - Connect to multiple Unleash instances (prod, staging, dev)
- 🏗️ **Multi-Environment Management** - Handle different environments within each instance
- 🚀 **Feature Flag Operations**:
  - Create new feature flags
  - Archive existing feature flags
  - List all feature flags with filtering
  - Get detailed feature flag status
  - Toggle feature flags on/off in specific environments
- 🌍 **Environment Management** - List and manage environments
- 📊 **Rich Formatting** - Beautiful, informative responses with emojis and status indicators

## Installation

```bash
bun install
bun run build
```

## Configuration

Currently, the server uses hardcoded configuration (interactive configuration coming soon). Edit the `UNLEASH_CONFIG` in `src/index.ts`:

```typescript
const UNLEASH_CONFIG: UnleashConfig = {
  instances: [
    {
      name: "production",
      url: "https://your-unleash-instance.com",
      token: "your-admin-token-here", // Admin API token
      project: "default", // Default project
    },
    {
      name: "staging", 
      url: "https://staging-unleash-instance.com",
      token: "your-staging-admin-token-here",
      project: "default",
    },
  ],
};
```

### API Token Requirements

You need **Admin API tokens** (or Service Account tokens) with the following permissions:
- Create feature flags
- Update feature flags
- Archive feature flags
- Read feature flags
- Manage environments

## Usage

### As a standalone server
```bash
bun run start
```

### In Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "unleash": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/unleash-server/build/index.js"]
    }
  }
}
```

## Available Tools

### `list_instances`
List all configured Unleash instances.

**Parameters:** None

**Example:**
```
Available Unleash instances:

**production**
  URL: https://your-unleash-instance.com
  Default Project: default

**staging**
  URL: https://staging-unleash-instance.com
  Default Project: default
```

### `create_feature`
Create a new feature flag in an Unleash instance.

**Parameters:**
- `instance` (string): Name of the Unleash instance
- `name` (string): Feature flag name
- `description` (string, optional): Feature flag description
- `type` (enum, optional): Type of feature flag (`release`, `experiment`, `operational`, `kill-switch`, `permission`)
- `project` (string, optional): Project name (uses instance default if not specified)

**Example:**
```
✅ Feature flag 'new-checkout-flow' created successfully in production (default project)
```

### `archive_feature`
Archive a feature flag in an Unleash instance.

**Parameters:**
- `instance` (string): Name of the Unleash instance
- `name` (string): Feature flag name
- `project` (string, optional): Project name

**Example:**
```
🗄️ Feature flag 'old-feature' archived successfully in production (default project)
```

### `list_features`
List all feature flags in an Unleash instance.

**Parameters:**
- `instance` (string): Name of the Unleash instance
- `project` (string, optional): Project name
- `environment` (string, optional): Filter by environment

**Example:**
```
Feature flags in production (default project):

Found 3 feature flag(s):
- Active: 2
- Disabled: 1
- Archived: 0
- Stale: 0

**new-checkout-flow** (release) ✅ ENABLED
Description: New checkout flow with improved UX
Project: default
Environments: development: ✅, staging: ✅, production: ❌
Created: 1/15/2025
---

**beta-features** (experiment) ❌ DISABLED
Project: default
Environments: development: ✅, staging: ❌, production: ❌
Created: 1/10/2025
⚠️ STALE
---
```

### `get_feature_status`
Get detailed status of a specific feature flag.

**Parameters:**
- `instance` (string): Name of the Unleash instance
- `name` (string): Feature flag name
- `project` (string, optional): Project name
- `environment` (string, optional): Show detailed environment info

**Example:**
```
**new-checkout-flow** (release) ✅ ENABLED
Description: New checkout flow with improved UX
Project: default
Environments: development: ✅, staging: ✅, production: ❌
Created: 1/15/2025

**production Environment Details:**
Status: ❌ DISABLED
Strategies: 2 configured
```

### `toggle_feature`
Enable or disable a feature flag in a specific environment.

**Parameters:**
- `instance` (string): Name of the Unleash instance
- `name` (string): Feature flag name
- `environment` (string): Environment name
- `enabled` (boolean): Whether to enable or disable
- `project` (string, optional): Project name

**Example:**
```
✅ ENABLED Feature flag 'new-checkout-flow' enabled in production environment (production - default project)
```

### `list_environments`
List all environments in an Unleash instance.

**Parameters:**
- `instance` (string): Name of the Unleash instance
- `project` (string, optional): Project name

**Example:**
```
Environments in production (default project):

**development** (development)
  Status: ✅ Enabled
  Protected: 🔓 No

**staging** (test)
  Status: ✅ Enabled
  Protected: 🔓 No

**production** (production)
  Status: ✅ Enabled
  Protected: 🔒 Yes
```

## Multi-Instance & Multi-Environment Support

### Multiple Instances
The server supports connecting to multiple Unleash instances simultaneously. This is useful for:
- **Production vs Staging**: Separate instances for different deployment stages
- **Multi-tenant**: Different instances for different customers/teams
- **Geographic**: Different instances for different regions

### Multiple Environments
Within each instance, you can work with multiple environments:
- **Development**: For local development and testing
- **Staging**: For pre-production testing
- **Production**: For live features
- **Custom environments**: Any environments you've configured in Unleash

### Example Workflow
```bash
# List available instances
list_instances

# Create a feature in staging
create_feature instance="staging" name="new-feature" description="Test feature"

# Enable it in development environment
toggle_feature instance="staging" name="new-feature" environment="development" enabled=true

# Check status across environments
get_feature_status instance="staging" name="new-feature"

# When ready, create the same feature in production
create_feature instance="production" name="new-feature" description="Test feature"

# Enable in production environment
toggle_feature instance="production" name="new-feature" environment="production" enabled=true
```

## Error Handling

The server provides detailed error messages for common issues:
- Invalid instance names
- Missing feature flags
- Network connectivity issues
- Authentication problems
- Invalid environment names

## Development

```bash
# Start in development mode with hot reload
bun run dev

# Type check
bun run typecheck

# Build
bun run build
```

## Roadmap

- [ ] Interactive configuration setup
- [ ] Environment variable support
- [ ] Bulk operations (enable/disable multiple features)
- [ ] Feature flag strategies management
- [ ] Metrics and analytics
- [ ] Import/export functionality
- [ ] Webhook notifications

## API Reference

This server uses the [Unleash Admin API](https://docs.getunleash.io/reference/api/unleash/features). Key endpoints used:

- `GET /api/admin/projects/{projectId}/features` - List features
- `POST /api/admin/projects/{projectId}/features` - Create feature
- `DELETE /api/admin/projects/{projectId}/features/{featureName}/archive` - Archive feature
- `POST /api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/on` - Enable feature
- `POST /api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/off` - Disable feature
- `GET /api/admin/projects/{projectId}/environments` - List environments