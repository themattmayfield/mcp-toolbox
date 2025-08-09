#!/usr/bin/env bun

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface ServerTemplate {
	name: string;
	description: string;
	version: string;
}

function createServerFromTemplate(template: ServerTemplate) {
	const serverDir = join(process.cwd(), "packages", template.name);

	if (existsSync(serverDir)) {
		console.error(`❌ Server '${template.name}' already exists!`);
		process.exit(1);
	}

	console.log(`🚀 Creating MCP server: ${template.name}`);

	// Create directory structure
	mkdirSync(join(serverDir, "src"), { recursive: true });

	// Create package.json
	const packageJson = {
		name: `@mcp-toolbox/${template.name}`,
		version: template.version,
		description: template.description,
		type: "module",
		main: "build/index.js",
		bin: {
			[`${template.name}-mcp-server`]: "./build/index.js",
		},
		scripts: {
			build: "tsc && chmod 755 build/index.js",
			dev: "bun --watch src/index.ts",
			start: "bun build/index.js",
			typecheck: "tsc --noEmit",
			clean: "rm -rf build",
		},
		files: ["build", "README.md"],
		dependencies: {
			"@modelcontextprotocol/sdk": "^1.17.2",
			"@mcp-toolbox/shared": "workspace:*",
			zod: "^3.25.76",
		},
		devDependencies: {
			"@types/node": "^24.2.1",
			typescript: "^5",
		},
		keywords: ["mcp", template.name],
	};

	writeFileSync(
		join(serverDir, "package.json"),
		JSON.stringify(packageJson, null, "\t"),
	);

	// Create tsconfig.json
	const tsConfig = {
		extends: "../../tsconfig.json",
		compilerOptions: {
			outDir: "./build",
			rootDir: "./src",
			composite: true,
		},
		include: ["src/**/*"],
		references: [{ path: "../shared" }],
	};

	writeFileSync(
		join(serverDir, "tsconfig.json"),
		JSON.stringify(tsConfig, null, "\t"),
	);

	// Create main server file
	const serverCode = `import { createMcpServer, createSuccessResponse, createErrorResponse } from '@mcp-toolbox/shared';
import { z } from 'zod';

async function main() {
	const { server, start } = createMcpServer({
		name: '${template.name}',
		version: '${template.version}',
		description: '${template.description}'
	});

	// Register your tools here
	server.tool(
		'example_tool',
		'An example tool - replace with your actual tools',
		{
			message: z.string().describe('A message to echo back')
		},
		async ({ message }) => {
			try {
				// TODO: Implement your tool logic here
				return createSuccessResponse(\`Echo: \${message}\`);
			} catch (error) {
				console.error('Error in example_tool:', error);
				return createErrorResponse('Failed to process request');
			}
		}
	);

	await start();
}

main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
`;

	writeFileSync(join(serverDir, "src", "index.ts"), serverCode);

	// Create README
	const readme = `# ${template.name.charAt(0).toUpperCase() + template.name.slice(1)} MCP Server

${template.description}

## Installation

\`\`\`bash
bun install
bun run build
\`\`\`

## Usage

### As a standalone server
\`\`\`bash
bun run start
\`\`\`

### In Claude Desktop
Add to your \`claude_desktop_config.json\`:

\`\`\`json
{
  "mcpServers": {
    "${template.name}": {
      "command": "node",
      "args": ["/path/to/mcp-toolbox/packages/${template.name}/build/index.js"]
    }
  }
}
\`\`\`

## Available Tools

### example_tool
An example tool - replace with your actual tools.

**Parameters:**
- \`message\` (string): A message to echo back

## Development

\`\`\`bash
# Start in development mode with hot reload
bun run dev

# Type check
bun run typecheck

# Build
bun run build
\`\`\`
`;

	writeFileSync(join(serverDir, "README.md"), readme);

	console.log(`✅ Created MCP server at packages/${template.name}`);
	console.log(`📝 Next steps:`);
	console.log(`   1. cd packages/${template.name}`);
	console.log(`   2. Edit src/index.ts to implement your tools`);
	console.log(`   3. bun run dev to start development`);
}

// CLI interface
const args = process.argv.slice(2);

if (args.length === 0) {
	console.log(
		"Usage: bun tools/create-server.ts <server-name> [description] [version]",
	);
	console.log(
		'Example: bun tools/create-server.ts my-api-server "API integration server" "1.0.0"',
	);
	process.exit(1);
}

const [name, description = "A new MCP server", version = "1.0.0"] = args;

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
	console.error(
		"❌ Server name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens",
	);
	process.exit(1);
}

createServerFromTemplate({ name, description, version });
