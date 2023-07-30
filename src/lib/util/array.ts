import { isEqual, without } from "lodash";

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export function stableWithout<T>(items: T[], arr: T[]) {
	return originalIfEqual(without(arr, ...items), arr);
}

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export function stableFilter<T>(
	predicate: (item: T) => boolean,
	arr: T[],
): T[] {
	return originalIfEqual(arr.filter(predicate), arr);
}

/**
 * Returns new array if items are modified, otherwise
 * returns original array
 */
export function stableAppendUnique<T>(items: T[], arr: T[]): T[] {
	return originalIfEqual(without(arr, ...items).concat(items), arr);
}

function originalIfEqual<T>(next: T[], orig: T[]) {
	return isEqual(next, orig) ? orig : next;
}
