import { memo } from "react";
import styled from "@emotion/styled";
import { memoize } from "lodash";
import color from "color";

import useConnection from "~/app-store/hooks/use-connection";

import type { FC } from "react";
import type { AudioNodeMeta } from "~/types";

const PatchBayNode: FC<{
	source: AudioNodeMeta;
	target: AudioNodeMeta;
}> = ({ source, target }) => {
	const { connection, isBlocked, toggleConnection } = useConnection(
		source,
		target,
	);
	const title = isBlocked
		? "This will cause a circular connection, big feedback, ear bleeding, much sadness"
		: `From ${source.label} to ${target.label}`;

	return (
		<Container
			title={title}
			activeColor={connection?.color}
			onClick={toggleConnection}
			tabIndex={0}
			disabled={isBlocked}
		/>
	);
};

export default memo(PatchBayNode);

const getActiveBorderColor = memoize((activeColor: string) =>
	color(activeColor).darken(0.06).hex(),
);

const Container = styled.button<{
	activeColor?: string | undefined;
}>`
	inline-size: 0.8em;
	block-size: 0.8em;
	margin: 0 auto;
	border: 1px solid
		${({ activeColor, theme }) =>
			activeColor ? getActiveBorderColor(activeColor) : theme.colors.text[100]};
	background-color: ${({ activeColor, disabled, theme }) =>
		activeColor ?? (disabled ? theme.colors.text[100] : "transparent")};
	transform: ${({ disabled }) =>
		disabled ? "rotate(45deg) scale(0.5)" : "rotate(0deg) scale(1)"};
	transition: all 0.2s ease-out;

	&:hover {
		border-color: ${({ activeColor, theme }) =>
			activeColor ?? theme.colors.text[400]};
	}
`;
