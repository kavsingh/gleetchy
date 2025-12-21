import tailwindcssPlugin from "@tailwindcss/vite";
import { defineConfig } from "rolldown-vite";
import checkerPlugin from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	return {
		base: process.env["VITE_BUILD_BASE"] ?? "/",
		build: { sourcemap: true },
		oxc: { jsx: { importSource: "solid-js" } },
		plugins: [
			tsconfigPathsPlugin(),
			solidPlugin(),
			tailwindcssPlugin(),
			checker(mode),
		],
	};
});

function checker(mode: string) {
	if (mode !== "development") return undefined;

	return checkerPlugin({
		overlay: { initialIsOpen: false },
		typescript: true,
	});
}
