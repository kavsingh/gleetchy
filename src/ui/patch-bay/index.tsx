import { memo, useMemo } from "react";
import { ErrorBoundary, For } from "solid-js";

import {
	selectConnectableSources,
	selectConnectableTargets,
} from "~/app-store/audio-nodes/selectors";
import { useAppSelector } from "~/app-store/hooks/base";

import PatchBayNode from "./patch-bay-node";

import type { PropsWithChildren } from "react";

export default memo(function PatchBay() {
	const sources = useAppSelector(selectConnectableSources);
	const targets = useAppSelector(selectConnectableTargets);

	const sourceLabels = useMemo(
		() => (
			<tr>
				<SourceLabel>To / From</SourceLabel>
				<For each={sources}>
					{(source) => (
						<SourceLabel title={`From ${source.label} to ...`} key={source.id}>
							{source.label}
						</SourceLabel>
					)}
				</For>
			</tr>
		),
		[sources],
	);

	return (
		<div class="w-full">
			<ErrorBoundary>
				<tbody>
					{sourceLabels}
					<For each={targets}>
						{(target) => (
							<tr>
								<TargetLabel
									title={`From ... to ${target.label}`}
									key="rowLabel"
								>
									{target.label}
								</TargetLabel>
								<For each={sources}>
									{(source) => (
										<td class="min-w-[1.4em]">
											<PatchBayNode source={source} target={target} />
										</td>
									)}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</ErrorBoundary>
		</div>
	);
});

function SourceLabel(props: PropsWithChildren<{ title?: string }>) {
	return (
		<th
			title={props.title}
			class="max-w-[5.4em] truncate pe-[0.4em] text-center text-[0.68em] font-normal first-of-type:text-start"
		>
			{props.children}
		</th>
	);
}

function TargetLabel(props: PropsWithChildren<{ title?: string }>) {
	return (
		<td
			title={props.title}
			class="max-w-[5.4em] truncate pb-[0.4em] text-center text-[0.68em] font-normal first-of-type:text-start [&:not(:first-of-type)]:p-0"
		>
			{props.children}
		</td>
	);
}
