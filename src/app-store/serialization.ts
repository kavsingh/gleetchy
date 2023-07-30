import type { AppState } from "~/app-store/configure-store";

const serializableStateKeys: (keyof AppState)[] = [
	"audioNodes",
	"connections",
	"audioFiles",
];

export function serialize(state: AppState) {
	const toSerialize: Record<string, unknown> = {};

	for (const key of serializableStateKeys) {
		toSerialize[key] = state[key];
	}

	return JSON.stringify(unsetUnserializable(toSerialize));
}

export function deserialize<T>(stateString: string) {
	try {
		const parsed: unknown = JSON.parse(stateString);

		return parsed as T;
	} catch (_e) {
		return undefined;
	}
}

function isObjectLike(value: unknown): value is Record<PropertyKey, unknown> {
	return typeof value === "object";
}

function isUnserializable(value: unknown) {
	return (
		value instanceof AudioBuffer ||
		value instanceof ArrayBuffer ||
		value instanceof Error
	);
}

function unsetUnserializable(value: unknown): unknown {
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
}
