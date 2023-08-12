export function clamp(min: number, max: number, value: number) {
	if (value < min) return min;
	if (value > max) return max;

	return value;
}

export function normalize(min: number, max: number, value: number) {
	return (value - min) / (max - min);
}

export function denormalize(min: number, max: number, value: number) {
	return min + value * (max - min);
}
