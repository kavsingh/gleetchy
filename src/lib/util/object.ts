import { omit } from "lodash";

/**
 * Returns new object if there are items to be removed, otherwise
 * returns original object
 */
export const stableOmit = <
	T extends Record<string, unknown>,
	K extends keyof T,
>(
	keys: K[],
	obj: T,
): Omit<T, K> => (keys.some((key) => key in obj) ? omit(obj, keys) : obj);
