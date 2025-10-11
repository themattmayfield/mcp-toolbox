# Unleash MCP Server

A Model Context Protocol server for managing Unleash feature flags across multiple instances and environments. This server provides a simple, user-friendly interface to control your feature flags without needing to access the Unleash web interface directly.

## What is This?

This MCP server connects to your Unleash feature flag service and lets you:
- **Manage Multiple Environments**: Control features across development, staging, and production
- **Work with Multiple Instances**: Connect to different Unleash servers (e.g., company-wide, team-specific)
- **Perform Common Operations**: Create, enable, disable, and archive feature flags
- **Get Clear Status Information**: See exactly where your features are enabled

Perfect for developers, DevOps engineers, and product managers who want to manage feature flags efficiently.

## Key Features

- ✅ **Multiple Instance Support** - Connect to multiple Unleash instances (prod, staging, dev)
- 🏗️ **Multi-Environment Management** - Handle different environments within each instance
- 🚀 **Complete Feature Flag Operations** - Create, toggle, archive, and monitor feature flags
- 🌍 **Environment Management** - List and understand your deployment environments
- 📊 **Rich, Clear Output** - Easy-to-read responses with status indicators
- 🔒 **Safe Operations** - Features are created disabled by default to prevent accidents

## Installation

Install globally via NPM:

```bash
npm install -g @mcp-toolbox/unleash-server
```

## Quick Setup

### Option 1: Interactive Setup (Recommended)
```bash
unleash-server-setup
```

This will guide you through connecting to your Unleash instances with a friendly interactive wizard.

### Option 2: Environment Variables
```bash
# Single instance
export UNLEASH_URL=https://your-unleash.com
export UNLEASH_TOKEN=your-admin-token

# Multiple instances
export UNLEASH_INSTANCES='[
  {
    "name": "production",
    "url": "https://your-unleash.com",
    "token": "your-admin-token",
    "project": "default"
  },
  {
    "name": "staging",
    "url": "https://staging-unleash.com", 
    "token": "staging-token",
    "project": "default"
  }
]'
```

### Option 3: Config File
Create `~/.config/mcp-toolbox/unleash-toolbox.json`:
```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://your-unleash.com",
      "token": "your-admin-token",
      "project": "default"
    }
  ]
}
```

### API Token Requirements

You need **Admin API tokens** (or Service Account tokens) with the following permissions:
- Create feature flags
- Update feature flags
- Archive feature flags
- Read feature flags
- Manage environments

## Usage

### Claude Desktop

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

Or with environment variables:
```json
{
  "mcpServers": {
    "unleash": {
      "command": "unleash-server-mcp-server",
      "env": {
        "UNLEASH_URL": "https://your-unleash.com",
        "UNLEASH_TOKEN": "your-admin-token"
      }
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
      "type": "local",
      "command": ["unleash-server-mcp-server"],
      "enabled": true
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

### Other MCP Clients

For any MCP-compatible client, use:
- **Command:** `unleash-server-mcp-server`
- **Arguments:** None required
- **Setup Command:** `unleash-server-setup` (for initial configuration)

## Interactive Setup Walkthrough

When you run `bun run setup`, you'll be guided through:

1. **🔍 Configuration Detection** - Checks for existing config
2. **📋 Instance Setup** - Add your Unleash instances one by one
3. **🔗 Connection Testing** - Validates URLs and API tokens
4. **📊 Discovery** - Shows available projects and environments  
5. **💾 Save Options** - Choose how to save your configuration
6. **📋 Next Steps** - Get your Claude Desktop config

The setup wizard will:
- ✅ Test connections in real-time
- ✅ Validate API tokens and permissions
- ✅ Discover projects and environments
- ✅ Generate Claude Desktop configuration
- ✅ Provide helpful error messages and recovery options

## Available Tools

This server provides 8 tools for managing your Unleash feature flags. Here's what each one does and when to use it:

### 🏢 Instance Management

#### `list_instances`
**What it does:** Shows all your configured Unleash servers (like production, staging, development)

**When to use:** 
- First time using the server to see what's available
- When you forget the exact name of an instance
- To verify your configuration is working

**Parameters:** None

**Example output:**
```
Available Unleash instances:

**production**
  URL: https://your-unleash-instance.com
  Default Project: default

**staging**
  URL: https://staging-unleash-instance.com
  Default Project: default
```

---

### 📋 Feature Flag Viewing

#### `list_features` ⭐ *Most commonly used*
**What it does:** Shows all feature flags in an instance, with their status in a specific environment

**When to use:**
- Daily feature flag management
- Checking what features are enabled in production
- Getting an overview of all your feature flags
- Seeing which features are stale or need attention

**Parameters:**
- `instance` (required): Which Unleash server (e.g., "production", "staging")
- `project` (optional): Project name (uses default if not specified)
- `environment` (optional): Which environment to show status for (uses instance default)

**Example output:**
```
Feature flags in production (default project) - production environment:

Found 3 feature flag(s):
- Active: 2
- Disabled: 1
- Archived: 0
- Stale: 0

**new-checkout-flow** (release) ✅ ENABLED
Description: New checkout flow with improved UX
Project: default
Environments: development: ✅, staging: ✅, production: ✅
Created: 1/15/2025
---

**beta-features** (experiment) ❌ DISABLED
Project: default
Environments: development: ✅, staging: ❌, production: ❌
Created: 1/10/2025
⚠️ STALE
---
```

**💡 Tip:** This is your go-to tool for checking feature flag status. It shows environment-specific status, which is usually what you need.

#### `get_feature_status`
**What it does:** Gets detailed information about one specific feature flag

**When to use:**
- Investigating a specific feature flag
- Checking strategies and detailed configuration
- Troubleshooting why a feature isn't working as expected

**Parameters:**
- `instance` (required): Which Unleash server
- `name` (required): Exact feature flag name
- `project` (optional): Project name
- `environment` (optional): Show detailed info for specific environment

**Example output:**
```
**new-checkout-flow** (release) ✅ ENABLED
Description: New checkout flow with improved UX
Project: default
Environments: development: ✅, staging: ✅, production: ✅
Created: 1/15/2025

**production Environment Details:**
Status: ✅ ENABLED
Strategies: 2 configured
```

#### `list_all_features` ⚠️ *Advanced use only*
**What it does:** Shows feature flags with their global status (not environment-specific)

**When to use:**
- Rarely needed - only when you specifically need global status
- Most users should use `list_features` instead

**Parameters:**
- `instance` (required): Which Unleash server
- `project` (optional): Project name

**Why you probably don't need this:** Global status can be confusing because a feature might be globally "disabled" but still enabled in specific environments. Use `list_features` for clearer, more useful information.

---

### ⚙️ Feature Flag Management

#### `create_feature`
**What it does:** Creates a new feature flag and automatically disables it in all environments

**When to use:**
- Adding a new feature to your application
- Setting up a feature flag before development starts
- Creating experimental features

**Parameters:**
- `instance` (required): Which Unleash server
- `name` (required): Feature flag name (use kebab-case like "new-checkout-flow")
- `description` (optional but recommended): What this feature does
- `type` (optional): Type of feature - `release` (default), `experiment`, `operational`, `kill-switch`, or `permission`
- `project` (optional): Project name

**Safety feature:** The feature is automatically disabled in ALL environments when created, preventing accidental activation.

**Example output:**
```
✅ Feature flag 'new-checkout-flow' created successfully in production (default project) and disabled in all environments: development, staging, production
```

**💡 Best practices:**
- Use descriptive names: "new-checkout-flow" not "feature1"
- Always add a description explaining what the feature does
- Choose the right type: `release` for new features, `experiment` for A/B tests, `kill-switch` for emergency shutoffs

#### `toggle_feature` ⭐ *Very commonly used*
**What it does:** Enables or disables a feature flag in a specific environment

**When to use:**
- Enabling a feature in development for testing
- Promoting a feature from staging to production
- Quickly disabling a problematic feature
- Rolling out features gradually across environments

**Parameters:**
- `instance` (required): Which Unleash server
- `name` (required): Feature flag name
- `environment` (required): Which environment ("development", "staging", "production")
- `enabled` (required): `true` to enable, `false` to disable
- `project` (optional): Project name

**Example output:**
```
✅ ENABLED Feature flag 'new-checkout-flow' enabled in production environment (production - default project)
```

**💡 Common workflow:**
1. Create feature (automatically disabled everywhere)
2. Enable in development for testing
3. Enable in staging for QA
4. Enable in production when ready

#### `archive_feature`
**What it does:** Archives (soft deletes) a feature flag when you no longer need it

**When to use:**
- Cleaning up old feature flags
- Removing features that are now permanent
- Decluttering your feature flag list

**Parameters:**
- `instance` (required): Which Unleash server
- `name` (required): Feature flag name
- `project` (optional): Project name

**Example output:**
```
🗄️ Feature flag 'old-feature' archived successfully in production (default project)
```

**💡 Note:** Archived flags can be restored if needed, so this is safe to do.

---

### 🌍 Environment Management

#### `list_environments`
**What it does:** Shows all available environments in your Unleash instance

**When to use:**
- Learning what environments are available
- Checking environment configuration
- Seeing which environments are protected (require special permissions)

**Parameters:**
- `instance` (required): Which Unleash server
- `project` (optional): Project name

**Example output:**
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

**💡 Understanding the output:**
- **Protected environments** (🔒) require special permissions to modify
- **Status** shows if the environment is active
- Use these exact environment names in `toggle_feature`

## Common Workflows

Here are the most common ways you'll use this server:

### 🚀 Creating and Rolling Out a New Feature

**Scenario:** You're adding a new checkout flow to your e-commerce site.

```bash
# 1. First, see what instances you have available
list_instances

# 2. Create the feature flag (automatically disabled everywhere for safety)
create_feature instance="production" name="new-checkout-flow" description="Improved checkout with one-click payments" type="release"

# 3. Enable in development for initial testing
toggle_feature instance="production" name="new-checkout-flow" environment="development" enabled=true

# 4. Check that it's working as expected
get_feature_status instance="production" name="new-checkout-flow"

# 5. Promote to staging for QA testing
toggle_feature instance="production" name="new-checkout-flow" environment="staging" enabled=true

# 6. After QA approval, enable in production
toggle_feature instance="production" name="new-checkout-flow" environment="production" enabled=true

# 7. Later, when the feature is stable and permanent, clean up
archive_feature instance="production" name="new-checkout-flow"
```

### 🔍 Daily Feature Flag Management

**Scenario:** You want to check the status of all your features.

```bash
# See what's currently enabled in production
list_features instance="production" environment="production"

# Check a specific feature that might be causing issues
get_feature_status instance="production" name="problematic-feature"

# Quickly disable it if there's a problem
toggle_feature instance="production" name="problematic-feature" environment="production" enabled=false
```

### 🧪 Managing Experiments

**Scenario:** You're running A/B tests and need to manage experimental features.

```bash
# Create an experiment
create_feature instance="production" name="homepage-redesign-test" description="A/B test for new homepage layout" type="experiment"

# Enable only in development first
toggle_feature instance="production" name="homepage-redesign-test" environment="development" enabled=true

# After testing, enable for a subset of production users (you'd configure targeting in Unleash UI)
toggle_feature instance="production" name="homepage-redesign-test" environment="production" enabled=true

# Check all your experiments
list_features instance="production" environment="production"
```

### 🚨 Emergency Feature Disable

**Scenario:** A feature is causing problems in production and needs to be disabled immediately.

```bash
# Quickly disable the problematic feature
toggle_feature instance="production" name="problematic-feature" environment="production" enabled=false

# Verify it's disabled
get_feature_status instance="production" name="problematic-feature"

# Check what other features might be affected
list_features instance="production" environment="production"
```

### 🏢 Multi-Instance Management

**Scenario:** You have separate Unleash instances for different teams or environments.

```bash
# Check what instances are available
list_instances

# Create the same feature in both staging and production instances
create_feature instance="staging" name="new-api-endpoint" description="New REST API endpoint for mobile app"
create_feature instance="production" name="new-api-endpoint" description="New REST API endpoint for mobile app"

# Test in staging first
toggle_feature instance="staging" name="new-api-endpoint" environment="development" enabled=true
toggle_feature instance="staging" name="new-api-endpoint" environment="staging" enabled=true

# After validation, enable in production instance
toggle_feature instance="production" name="new-api-endpoint" environment="production" enabled=true
```

## Understanding Multi-Instance & Multi-Environment Support

### Multiple Instances
You can connect to multiple Unleash servers simultaneously. Common setups:

- **Separate Staging/Production**: Different Unleash servers for different deployment stages
- **Team-Based**: Different instances for different teams or products
- **Geographic**: Different instances for different regions or data centers
- **Customer-Based**: Different instances for different customers (multi-tenant)

### Multiple Environments
Within each instance, you work with multiple environments:

- **development**: For local development and initial testing
- **staging/test**: For pre-production testing and QA
- **production**: For live features affecting real users
- **Custom environments**: Any additional environments you've configured

### Best Practices

**🎯 Feature Flag Naming:**
- Use descriptive, kebab-case names: `new-checkout-flow`, `mobile-app-redesign`
- Include the purpose: `experiment-homepage-layout`, `killswitch-payment-gateway`
- Avoid generic names: `feature1`, `test`, `new-thing`

**🔄 Rollout Strategy:**
1. **Create** feature (automatically disabled everywhere)
2. **Enable in development** for initial testing
3. **Enable in staging** for QA and integration testing
4. **Enable in production** when ready for users
5. **Archive** when feature is permanent or no longer needed

**🛡️ Safety Tips:**
- Features are created disabled by default - this prevents accidents
- Always test in development and staging before production
- Use `get_feature_status` to verify changes before and after
- Keep feature flags temporary - archive them when no longer needed

**⚡ Quick Operations:**
- Use `list_features` daily to see what's active
- Use `toggle_feature` for quick enable/disable operations
- Use `get_feature_status` when troubleshooting specific features

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

## Quick Reference

### 📋 Most Common Commands

```bash
# See what Unleash servers you have
list_instances

# Check all features in production
list_features instance="production"

# Create a new feature (starts disabled)
create_feature instance="production" name="my-new-feature" description="What this feature does"

# Enable feature in development
toggle_feature instance="production" name="my-new-feature" environment="development" enabled=true

# Check specific feature status
get_feature_status instance="production" name="my-new-feature"

# Enable in production when ready
toggle_feature instance="production" name="my-new-feature" environment="production" enabled=true

# Clean up when done
archive_feature instance="production" name="my-new-feature"
```

### 🎯 Parameter Quick Guide

**Required vs Optional Parameters:**
- ✅ **Always required**: `instance`, `name` (for feature operations)
- 🔧 **Usually optional**: `project` (uses default), `description`
- 📍 **Context dependent**: `environment` (required for toggle, optional for list)

**Common Parameter Values:**
- **instance**: `"production"`, `"staging"`, `"development"` (whatever you configured)
- **environment**: `"development"`, `"staging"`, `"production"` (check with `list_environments`)
- **type**: `"release"` (default), `"experiment"`, `"operational"`, `"kill-switch"`, `"permission"`
- **enabled**: `true` or `false`

### 🔄 Typical Workflow Cheat Sheet

**New Feature Rollout:**
1. `create_feature` → Creates disabled feature
2. `toggle_feature` in development → Test locally  
3. `toggle_feature` in staging → QA testing
4. `toggle_feature` in production → Go live
5. `archive_feature` → Clean up when permanent

**Daily Management:**
1. `list_features` → See what's active
2. `get_feature_status` → Check specific features
3. `toggle_feature` → Quick enable/disable

**Emergency Response:**
1. `toggle_feature` with `enabled=false` → Disable immediately
2. `get_feature_status` → Verify it's disabled
3. `list_features` → Check for other affected features

## API Reference

This server uses the [Unleash Admin API](https://docs.getunleash.io/reference/api/unleash/features). Key endpoints used:

- `GET /api/admin/projects/{projectId}/features` - List features
- `POST /api/admin/projects/{projectId}/features` - Create feature
- `DELETE /api/admin/projects/{projectId}/features/{featureName}` - Archive feature
- `POST /api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/on` - Enable feature
- `POST /api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/off` - Disable feature
- `GET /api/admin/projects/{projectId}/environments` - List environments

## Tips and Best Practices

### 🎯 Naming Your Feature Flags
**Good names:**
- `new-checkout-flow` - Clear purpose, kebab-case
- `experiment-homepage-redesign` - Indicates it's temporary
- `killswitch-payment-gateway` - Shows it's for emergency use

**Avoid:**
- `feature1`, `test`, `new-thing` - Too generic
- `NewCheckoutFlow` - Use kebab-case instead
- `checkout_flow_new` - Inconsistent naming

### 🔄 Feature Flag Lifecycle
1. **Create** → Always starts disabled for safety
2. **Test** → Enable in development first
3. **Validate** → Enable in staging for QA
4. **Deploy** → Enable in production when ready
5. **Monitor** → Watch for issues, disable if needed
6. **Clean up** → Archive when permanent or no longer needed

### 🛡️ Safety Guidelines
- **Never enable directly in production** - Always test in lower environments first
- **Use descriptive descriptions** - Future you will thank you
- **Monitor after enabling** - Watch logs and metrics
- **Have a rollback plan** - Know how to quickly disable features
- **Clean up regularly** - Archive old flags to reduce clutter

### ⚡ Efficiency Tips
- **Use `list_features` daily** - Stay aware of what's active
- **Bookmark common commands** - Save frequently used combinations
- **Group related features** - Use consistent naming for related flags
- **Document complex features** - Add good descriptions for team members

## Troubleshooting

### 🔧 Configuration Issues

**❌ "No Unleash configuration found"**
```bash
# Solution 1: Run the interactive setup
bun run setup

# Solution 2: Set environment variables
export UNLEASH_URL=https://your-unleash.com
export UNLEASH_TOKEN=your-admin-token

# Solution 3: Check config file exists
ls ~/.config/mcp-toolbox/unleash-toolbox.json
```

**❌ "Authentication failed - check your API token"**
- ✅ Use an **Admin API token** or **Service Account token** (not Client token)
- ✅ Check token hasn't expired in Unleash admin UI
- ✅ Verify token has permissions: create, read, update, delete features
- ✅ Make sure token format is correct (usually starts with `*:`)

**❌ "Connection timeout - check your URL and network"**
- ✅ Verify Unleash URL is correct and accessible
- ✅ Include protocol: `https://your-unleash.com` not `your-unleash.com`
- ✅ Check if you're behind a corporate firewall
- ✅ Test URL in browser to confirm it's reachable

### 🛠️ Setup Issues

**❌ Setup wizard won't start**
```bash
# Make sure dependencies are installed
bun install
bun run build

# Try running setup directly
bun src/setup.ts
```

**❌ Can't save configuration**
```bash
# Create config directory
mkdir -p ~/.config/mcp-toolbox

# Check permissions
ls -la ~/.config/mcp-toolbox

# Alternative: Use environment variables instead
export UNLEASH_INSTANCES='[{"name":"prod","url":"https://unleash.com","token":"token"}]'
```

### 🚨 Runtime Issues

**❌ "Unknown Unleash instance: xyz"**
```bash
# Check what instances are available
list_instances

# Make sure you're using the exact name from the list
# Names are case-sensitive: "production" ≠ "Production"
```

**❌ "Failed to retrieve features"**
- ✅ Check API token has read permissions
- ✅ Verify project name exists in Unleash (try "default")
- ✅ Test network connectivity to Unleash server
- ✅ Check Unleash server is running and accessible

**❌ "Environment 'xyz' is not configured"**
```bash
# See what environments are available
list_environments instance="your-instance"

# Use exact environment names from the list
```

### 🆘 Getting Help

**Step 1: Verify Configuration**
```bash
# Check your instances are configured correctly
list_instances

# This should show your Unleash servers
```

**Step 2: Test Basic Connectivity**
```bash
# Try listing features to test connection
list_features instance="your-instance"

# If this fails, it's likely a connection or auth issue
```

**Step 3: Check Permissions**
- Log into Unleash web UI with the same token
- Verify you can create/edit features manually
- Check token hasn't expired

**Step 4: Review Error Messages**
- Error messages usually contain specific guidance
- Look for keywords like "authentication", "network", "permission"
- Check console output for detailed error information

**Common Solutions:**
- 🔄 **Restart the server** - Sometimes fixes temporary issues
- 🔑 **Regenerate API token** - If authentication keeps failing  
- 🌐 **Check network** - Ensure Unleash server is accessible
- 📝 **Verify configuration** - Double-check URLs and instance names