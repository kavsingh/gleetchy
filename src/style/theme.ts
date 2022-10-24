export type ThemeName = "dark" | "light";

interface Fonts {
	body: string;
}

interface Colors {
	text: { 100: string; 400: string; 600: string };
	surface: { 0: string };
	semantic: { error: string; focus: string };
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
			surface: { 0: "rgb(16 16 16)" },
			text: {
				100: "rgb(25 85 85)",
				400: "rgb(200 200 200)",
				600: "rgb(255 255 255)",
			},
			semantic: { error: "rgb(236 103 100)", focus: "rgb(200 200 200)" },
		},
	},
	light: {
		fonts,
		name: "light",
		colors: {
			surface: { 0: "rgb(255 255 255)" },
			text: {
				100: "rgb(232 232 232)",
				400: "rgb(34 34 34)",
				600: "rgb(0 0 0)",
			},
			semantic: { error: "rgb(236 103 100)", focus: "rgb(34 34 34)" },
		},
	},
};

export const defaultTheme = themes.light;
