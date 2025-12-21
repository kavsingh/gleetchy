import { defineConfig } from "eslint/config";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import { configs as tsEslint } from "typescript-eslint";

export default defineConfig(
	{
		ignores: [".vscode/*", ".nx/*", ".temp/*", "apps/*", "packages/*"],
	},

	{
		languageOptions: { parserOptions: { projectService: true } },
		linterOptions: { reportUnusedDisableDirectives: true },
	},

	tsEslint.base,
	// @ts-expect-error upstream types
	importX.typescript,

	{
		rules: {
			"import-x/order": [
				"warn",
				{
					"alphabetize": { order: "asc" },
					"groups": [
						"builtin",
						"external",
						"internal",
						"parent",
						["sibling", "index"],
						"type",
					],
					"newlines-between": "always",
					"pathGroupsExcludedImportTypes": ["type"],
				},
			],
		},
	},

	{
		files: ["**/*.c[tj]s?(x)"],
		languageOptions: {
			parserOptions: { sourceType: "commonjs" },
			sourceType: "commonjs",
		},
	},
);
