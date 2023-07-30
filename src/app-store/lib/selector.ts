import { deepEqual } from "fast-equals";
import { createSelectorCreator, defaultMemoize } from "reselect";

export const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	deepEqual,
);
