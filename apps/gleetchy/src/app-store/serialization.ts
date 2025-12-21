import type { AppState } from "#app-store/create";

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

export function deserialize(stateString: string) {
	try {
		return JSON.parse(stateString);
	} catch {
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
		return value.map((item) => unsetUnserializable(item));
	}

	if (isObjectLike(value)) {
		const copy = { ...value };

		for (const [key, val] of Object.entries(copy)) {
			copy[key] = unsetUnserializable(val);
		}

		return copy;
	}

	return value;
}
