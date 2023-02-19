import { memo } from "react";
import styled from "@emotion/styled";
import { memoize } from "lodash";
import color from "color";

import useConnection from "~/app-store/hooks/use-connection";

import type { AudioNodeMeta } from "~/types";

export default memo(function PatchBayNode({
	source,
	target,
}: {
	source: AudioNodeMeta;
	target: AudioNodeMeta;
}) {
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
			className="p-0 bs-3 is-3 mlb-0 mli-auto"
		/>
	);
});

const getActiveBorderColor = memoize(function getActiveColor(
	activeColor: string,
) {
	return color(activeColor).darken(0.06).hex();
});

const Container = styled.button<{
	activeColor?: string | undefined;
}>`
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
