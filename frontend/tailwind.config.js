/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				overlay: "#18181B",
				divider: "#262626",
				muted: "#52525B",
				gold: "#CA8A04",
			},
		},
	},
	plugins: [],
};
