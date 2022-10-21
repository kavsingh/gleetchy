import { isEqual } from "lodash";
import { createSelectorCreator, defaultMemoize } from "reselect";

export const createValueEqSelector = createSelectorCreator(
	defaultMemoize,
	isEqual,
);
