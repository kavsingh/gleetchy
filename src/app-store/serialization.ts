import type { AppState } from "~/app-store/configure-store";

const isObjectLike = (value: unknown): value is Record<PropertyKey, unknown> =>
	typeof value === "object";

const isUnserializable = (value: unknown) =>
	value instanceof AudioBuffer ||
	value instanceof ArrayBuffer ||
	value instanceof Error;

const unsetUnserializable = (value: unknown): unknown => {
	if (isUnserializable(value)) return undefined;

	if (Array.isArray(value)) {
		return (value as unknown[]).map(unsetUnserializable);
	}

	if (isObjectLike(value)) {
		const copy = { ...value };

		Object.entries(copy).forEach(([key, val]) => {
			copy[key] = unsetUnserializable(val);
		});

		return copy;
	}

	return value;
};

const serializableStateKeys: (keyof AppState)[] = [
	"audioNodes",
	"connections",
	"audioFiles",
];

export const serialize = (state: AppState) => {
	const toSerialize: Record<string, unknown> = {};

	for (const key of serializableStateKeys) {
		toSerialize[key] = state[key];
	}

	return JSON.stringify(unsetUnserializable(toSerialize));
};

export const deserialize = <T>(stateString: string): T | undefined => {
	try {
		const parsed: unknown = JSON.parse(stateString);

		return parsed as T | undefined;
	} catch (_e) {
		return undefined;
	}
};
