import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		sentryVitePlugin({
			org: "artem-kw",
			project: "test-1",
		}),
	],
	build: {
		sourcemap: true,
	},
});
