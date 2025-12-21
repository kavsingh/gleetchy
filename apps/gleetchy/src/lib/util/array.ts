import { deepEqual } from "fast-equals";

// TODO: drop these helpers (or only allow primitive value arrays)

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export function stableWithout<T>(items: T[], arr: T[]) {
	return originalIfEqual(without(items, arr), arr);
}

/**
 * Returns new array if there are items to be removed, otherwise
 * returns original array
 */
export function stableFilter<T>(
	predicate: (item: T) => boolean,
	arr: T[],
): T[] {
	return originalIfEqual(
		arr.filter((item) => predicate(item)),
		arr,
	);
}

/**
 * Returns new array if items are modified, otherwise
 * returns original array
 */
export function stableAppendUnique<T>(items: T[], arr: T[]): T[] {
	return originalIfEqual([...without(items, arr), ...items], arr);
}

function without<T>(items: T[], arr: T[]) {
	const next: T[] = [];

	for (const arrItem of arr) {
		if (!items.includes(arrItem)) next.push(arrItem);
	}

	return next;
}

function originalIfEqual<T>(next: T[], orig: T[]) {
	return deepEqual(next, orig) ? orig : next;
}
