import type { ImpulseName } from "./impulses";

export const defaultProps = {
	wetDryRatio: 0.5,
	impulse: "wet" as ImpulseName,
};

export type Props = typeof defaultProps;
