import { noop } from "lodash";
import { useMemo } from "react";

import Button from "./button";
import TextInput from "./text-input";

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
						className="me-1 h-3 w-3 shrink-0 grow-0 border-current bg-current"
						style={{ color }}
						key={`${from}${to}`}
					/>
				))}
			</>
		),
		[connections],
	);

	return (
		<div className="mb-2 text-xs">
			<div className="flex items-center justify-start">
				<div className="flex h-full">{connectionIndicators}</div>
				<TextInput onChange={onLabelChange} value={label} />
			</div>
			<div className="flex items-center">
				<div className="me-1">{type} /</div>
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
