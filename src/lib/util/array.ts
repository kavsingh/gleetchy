import { isEqual, without } from "lodash";

const origIfEqual = <T>(next: T[], orig: T[]) =>
	isEqual(next, orig) ? orig : next;

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableWithout = <T>(items: T[], arr: T[]) =>
	origIfEqual(without(arr, ...items), arr);

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export const stableFilter = <T>(
	predicate: (item: T) => boolean,
	arr: T[],
): T[] => origIfEqual(arr.filter(predicate), arr);

/**
 * Returns new array if items are modified, otherwise
 * returns original array
 */
export const stableAppendUnique = <T>(items: T[], arr: T[]): T[] =>
	origIfEqual(without(arr, ...items).concat(items), arr);
