import type { ImpulseName } from "./impulses";

export const defaultProps: Props = {
	wetDryRatio: 0.5,
	impulse: "wide",
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Props = { wetDryRatio: number; impulse: ImpulseName };
