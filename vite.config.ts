import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
//  import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
});
