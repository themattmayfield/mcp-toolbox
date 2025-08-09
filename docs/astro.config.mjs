// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "MCP Toolbox",
			description: "A collection of Model Context Protocol servers",
			customCss: ["./src/styles/custom.css"],
			components: {
				ThemeSelect: "./src/components/ThemeSelect.astro",
			},
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Intro", slug: "index" },
						{ label: "Quick Start", slug: "getting-started" },
					],
				},
				{
					label: "MCP Servers",
					items: [
						{ label: "Weather Server", slug: "servers/weather" },
						{ label: "Unleash Server", slug: "servers/unleash" },
					],
				},
			],
		}),
	],
});
