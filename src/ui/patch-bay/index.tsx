import { memo, useMemo } from "react";

import {
	selectConnectableSources,
	selectConnectableTargets,
} from "~/app-store/audio-nodes/selectors";
import ErrorBoundary from "~/components/error-boundary";
import { useAppSelector } from "~/app-store/hooks/base";

import PatchBayNode from "./patch-bay-node";

import type { PropsWithChildren } from "react";

export default memo(function PatchBay() {
	const sources = useAppSelector(selectConnectableSources);
	const targets = useAppSelector(selectConnectableTargets);

	const sourceLabels = useMemo(
		() => (
			<tr key="source-labels">
				<SourceLabel>To / From</SourceLabel>
				{sources.map((source) => (
					<SourceLabel title={`From ${source.label} to ...`} key={source.id}>
						{source.label}
					</SourceLabel>
				))}
			</tr>
		),
		[sources],
	);

	return (
		<div className="is-full">
			<ErrorBoundary>
				<tbody>
					{sourceLabels}
					{targets.map((target) => (
						<tr key={target.id}>
							<TargetLabel title={`From ... to ${target.label}`} key="rowLabel">
								{target.label}
							</TargetLabel>
							{sources.map((source) => (
								<td
									className="min-is-[1.4em]"
									key={`${source.id}-${target.id}`}
								>
									<PatchBayNode source={source} target={target} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</ErrorBoundary>
		</div>
	);
});

function SourceLabel(props: PropsWithChildren<{ title?: string }>) {
	return (
		<th
			title={props.title}
			className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-[0.68em] font-normal max-is-[5.4em] pie-[0.4em] first-of-type:text-left"
		>
			{props.children}
		</th>
	);
}

function TargetLabel(props: PropsWithChildren<{ title?: string }>) {
	return (
		<td
			title={props.title}
			className="overflow-hidden text-ellipsis whitespace-nowrap pb-[0.4em] text-center text-[0.68em] font-normal max-is-[5.4em] first-of-type:text-left [&:not(:first-of-type)]:plb-0 [&:not(:first-of-type)]:pli-0"
		>
			{props.children}
		</td>
	);
}
