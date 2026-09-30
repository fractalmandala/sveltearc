import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Deploying to Vercel. Pin the runtime so the local Node version does not
			// decide it (adapter-vercel rejects Node versions it does not support).
			adapter: adapter({ runtime: 'nodejs22.x' }),
			preprocess: vitePreprocess(),
			alias: {
				$site: 'src/site'
			}
		})
	],

	// bits-ui and @lucide/svelte ship raw `.svelte` (and runes `.svelte.js`) files.
	// If Vite externalizes them for SSR, Node loads those files directly and throws
	// ERR_UNKNOWN_FILE_EXTENSION / rune_outside_svelte — so bundle deps for SSR.
	ssr: {
		noExternal: true
	}
});
