import { useMemo } from "react";
import { noop } from "lodash";

import TextInput from "./text-input";
import Button from "./button";

import type { PropsWithChildren } from "react";
import type { AudioNodeConnection } from "~/types";

export default function TitleBar({
	label,
	type,
	onLabelChange = noop,
	onRemoveClick = noop,
	connections = [],
	children,
}: Props) {
	const connectionIndicators = useMemo(
		() => (
			<>
				{connections.map(({ color, from, to }) => (
					<div
						className="shrink-0 grow-0 border-current bg-current bs-3 is-3 mie-1"
						style={{ color }}
						key={`${from}${to}`}
					/>
				))}
			</>
		),
		[connections],
	);

	return (
		<div className="text-xs mbe-2">
			<div className="flex items-center justify-start">
				<div className="flex bs-full">{connectionIndicators}</div>
				<TextInput onChange={onLabelChange} value={label} />
			</div>
			<div className="flex items-center">
				<div className="mie-1">{type} /</div>
				{children}
				<Button onClick={onRemoveClick}>Remove</Button>
			</div>
		</div>
	);
}

type Props = PropsWithChildren<{
	label: string;
	type: string;
	connections?: AudioNodeConnection[];
	onLabelChange?(label: string): unknown;
	onRemoveClick?(): unknown;
}>;
