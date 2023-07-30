/**
 * Returns new object if there are items to be removed, otherwise
 * returns original object
 */
export function stableOmit<T extends object, K extends keyof T>(
	keys: K[],
	obj: T,
) {
	if (!keys.some((key) => key in obj)) return obj;

	// TODO: see if can type this better

	return Object.fromEntries(
		Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
	) as unknown as Omit<T, K>;
}
