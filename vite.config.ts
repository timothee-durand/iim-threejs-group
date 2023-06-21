import {defineConfig} from 'vite'

/** @type {import('vite').UserConfig} */
export default defineConfig({
	assetsInclude: [
		'**/*.glb'
	],
	base: process.env.APP_ENV === 'production' ? '/iim-threejs-group/' : '/',
})