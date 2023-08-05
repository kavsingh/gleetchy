import type { ImpulseName } from "./impulses";

export const defaultProps: Props = {
	wetDryRatio: 0.5,
	impulse: "wide",
};

export type Props = { wetDryRatio: number; impulse: ImpulseName };
