import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse, toPlainObject } from "css-tree";

import type { ClassSelector } from "css-tree";

export default async function resolveCssVars() {
	return parseCss(await readCss());
}

async function readCss() {
	const __dirname = fileURLToPath(new URL(".", import.meta.url));

	return readFile(path.resolve(__dirname, "../src/style/colors.css"), "utf-8");
}

function parseCss(content: string) {
	const root = toPlainObject(parse(content));
	const output: Record<string, Record<string, string>> = {};

	if (root.type !== "StyleSheet") return output;

	for (const child of root.children) {
		if (child.type !== "Rule") continue;

		const { prelude, block } = child;

		if (prelude.type !== "SelectorList") continue;

		let classSelector: ClassSelector | undefined = undefined;

		for (const preludeChild of prelude.children) {
			if (preludeChild.type !== "Selector") continue;

			const selectorChild = preludeChild.children[0];

			if (selectorChild?.type === "ClassSelector") {
				classSelector = selectorChild;
			}
		}

		if (!classSelector) continue;

		const selectorBlock = output[classSelector.name] ?? {};

		for (const blockChild of block.children) {
			if (blockChild.type !== "Declaration") continue;

			const value = blockChild.value;

			if (value.type !== "Raw") continue;

			selectorBlock[blockChild.property] = value.value.trim();
		}

		output[classSelector.name] = selectorBlock;
	}

	return output;
}
