declare module "raf-throttle" {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const throttled: <T extends (...args: any[]) => unknown>(
		fn: T,
	) => T & { cancel: () => void };

	export default throttled;
}
