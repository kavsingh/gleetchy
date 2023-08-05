// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Mutable<T extends Record<string, any>, K = keyof T> = {
	[P in K]: T[P];
};

declare type Nullable<T> = T | null | undefined;
