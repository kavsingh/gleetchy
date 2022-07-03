import { anyPass, pick, pipe } from "ramda";

import type { AppState } from "~/app-store/configure-store";

const isObjectLike = (value: unknown): value is { [key: string]: unknown } =>
	typeof value === "object";

// eslint-disable-next-line @typescript-eslint/ban-types
const isInstanceOf = (ctor: Function) => (instance: unknown) =>
	instance instanceof ctor;

const isUnserializable = anyPass([
	isInstanceOf(AudioBuffer),
	isInstanceOf(ArrayBuffer),
	isInstanceOf(Error),
]);

const unsetUnserializable = (struct: unknown): unknown => {
	if (isUnserializable(struct)) return undefined;

	if (Array.isArray(struct)) {
		return (struct as unknown[]).map(unsetUnserializable);
	}

	if (isObjectLike(struct)) {
		const copy = { ...struct };

		Object.entries(copy).forEach(([key, value]) => {
			copy[key] = unsetUnserializable(value);
		});

		return copy;
	}

	return struct;
};

export const serialize: (state: AppState) => string = pipe(
	pick<keyof AppState>(["audioNodes", "connections", "audioFiles"]),
	(state: Partial<AppState>) => JSON.stringify(unsetUnserializable(state)),
);

export const deserialize = <T>(stateString: string): T | undefined => {
	try {
		const parsed: unknown = JSON.parse(stateString);

		return parsed as T | undefined;
	} catch (_e) {
		return undefined;
	}
};
