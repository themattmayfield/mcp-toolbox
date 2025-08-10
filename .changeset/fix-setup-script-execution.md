---
"@mcp-toolbox/unleash-server": patch
---

Fix setup script execution in Node.js

- Replace Bun-specific import.meta.main with Node.js compatible check
- This fixes the unleash-server-setup command not running when executed as a binary