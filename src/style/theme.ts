export type ThemeName = "dark" | "light";

interface Fonts {
	body: string;
}

interface Colors {
	page: string;
	body: string;
	emphasis: string;
	keyline: string;
	error: string;
}

export interface UITheme {
	name: ThemeName;
	colors: Colors;
	fonts: Fonts;
}

const fonts: Fonts = {
	body: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

export const themes: Record<ThemeName, UITheme> = {
	dark: {
		fonts,
		name: "dark",
		colors: {
			page: "rgba(16, 16, 16, 1)",
			body: "rgba(200, 200, 200, 1)",
			emphasis: "rgba(255, 255, 255, 1)",
			keyline: "rgba(25, 85, 85, 1)",
			error: "rgba(236, 103, 100, 1)",
		},
	},
	light: {
		fonts,
		name: "light",
		colors: {
			page: "rgba(255, 255, 255, 1)",
			body: "rgba(34, 34, 34, 1)",
			emphasis: "rgba(0, 0, 0, 1)",
			keyline: "rgba(232, 232, 232, 1)",
			error: "rgba(236, 103, 100, 1)",
		},
	},
};

export const defaultTheme = themes.light;
