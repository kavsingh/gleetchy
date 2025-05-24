import { createSelectorCreator, lruMemoize } from "@reduxjs/toolkit";
import { deepEqual } from "fast-equals";

export const createDeepEqualSelector = createSelectorCreator(
	lruMemoize,
	deepEqual,
);
