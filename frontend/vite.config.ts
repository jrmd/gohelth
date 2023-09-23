import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"react": "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",     // Must be below test-utils
			"react/jsx-runtime": "preact/jsx-runtime"
		},
	},
});
