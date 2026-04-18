import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	return {
		base: process.env["VITE_BUILD_BASE"] ?? "/",
		oxc: { jsx: { importSource: "solid-js" } },
		plugins: [
			tsconfigPaths(),
			solid(),
			tailwindcss(),
			mode === "development"
				? checker({ oxlint: true, overlay: { initialIsOpen: false } })
				: undefined,
		],
	};
});
