import path from "node:path";
import { readFile } from "node:fs/promises";

import { parse, toPlainObject } from "css-tree";

import type { ClassSelector } from "css-tree";

export default async function resolveCssVars() {
	return parseCss(await readCss());
}

async function readCss() {
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

		for (const pchild of prelude.children) {
			if (pchild.type !== "Selector") continue;

			const selectorChild = pchild.children[0];

			if (selectorChild.type === "ClassSelector") {
				classSelector = selectorChild;
			}
		}

		if (!classSelector) continue;

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const selectorBlock = output[classSelector.name] ?? {};

		for (const bchild of block.children) {
			if (bchild.type !== "Declaration") continue;

			const value = bchild.value;

			if (value.type !== "Raw") continue;

			selectorBlock[bchild.property] = value.value.trim();
		}

		output[classSelector.name] = selectorBlock;
	}

	return output;
}

if (require.main === module) {
	void resolveCssVars().then(console.log);
}

/*
sample plain object:
{
  "type": "StyleSheet",
  "loc": null,
  "children": [
    {
      "type": "Rule",
      "loc": null,
      "prelude": {
        "type": "SelectorList",
        "loc": null,
        "children": [
          {
            "type": "Selector",
            "loc": null,
            "children": [
              {
                "type": "PseudoClassSelector",
                "loc": null,
                "name": "root",
                "children": null
              }
            ]
          },
          {
            "type": "Selector",
            "loc": null,
            "children": [
              {
                "type": "ClassSelector",
                "loc": null,
                "name": "dark"
              }
            ]
          }
        ]
      },
      "block": {
        "type": "Block",
        "loc": null,
        "children": [
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-surface0",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(16, 16, 16)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-text100",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(25, 85, 85)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-text400",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(200, 200, 200)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-text600",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(255, 255, 255)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-semanticError",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(236 103 100)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-semanticFocus",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(200 200 200)"
            }
          }
        ]
      }
    },
    {
      "type": "Rule",
      "loc": null,
      "prelude": {
        "type": "SelectorList",
        "loc": null,
        "children": [
          {
            "type": "Selector",
            "loc": null,
            "children": [
              {
                "type": "ClassSelector",
                "loc": null,
                "name": "light"
              }
            ]
          }
        ]
      },
      "block": {
        "type": "Block",
        "loc": null,
        "children": [
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-surface0",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(255, 255, 255)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-text100",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(232, 232, 232)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-text400",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(34, 34, 34)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-text600",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(0, 0, 0)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-semanticError",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(236 103 100)"
            }
          },
          {
            "type": "Declaration",
            "loc": null,
            "important": false,
            "property": "--color-semanticFocus",
            "value": {
              "type": "Raw",
              "loc": null,
              "value": " rgb(34 34 34)"
            }
          }
        ]
      }
    }
  ]
}
*/
