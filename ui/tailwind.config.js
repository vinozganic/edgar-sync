/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
	purge: {
		content: [
			"./src/**/*.vue",
			"./src/**/*.js",
			"./src/**/*.jsx",
			"./src/**/*.ts",
			"./src/**/*.tsx",
			"./src/**/*.html",
			"./index.html",
		],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
