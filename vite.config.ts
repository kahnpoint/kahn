import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { esbuildDecorators } from 'esbuild-decorators'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildDecorators()],
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'kahn',
			fileName: (format) => `kahn.${format}.js`,
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
})
