/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	container: {
		center: true,
		padding: "15px",
	},
	screens: {
		sm: '640px',
		md: '768px',
		lg: '960px',
		xl: '1200px',
	},
	fontFamily: {
		primary: "var(--font-jetbrainsMono)",
	},
  	extend: {
  		colors: {
			bgLight: "#e5e9ec",
			bgDark: "#080f0f",
			fGreen: "#4f772d",
			cBlue: "#3772ff",
			iRed: "#f03a47",
			bgNavLight: "#d4c5c7",
			bgNavDark: "#393d3f",
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
