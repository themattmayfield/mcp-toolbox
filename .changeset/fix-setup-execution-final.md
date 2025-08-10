---
"@mcp-toolbox/unleash-server": patch
---

Fix setup script execution by always running main function

- Simplify execution logic to always run main() when script is loaded
- This ensures unleash-server-setup command works properly when installed globally