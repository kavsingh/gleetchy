import { ErrorBoundary, For } from "solid-js";

import {
	selectConnectableSources,
	selectConnectableTargets,
} from "~/app-store/connections/selectors";
import { useAppSelector } from "~/app-store/hooks/base";
import ErrorMessage from "~/components/error-message";

import PatchBayNode from "./patch-bay-node";

import type { ParentProps } from "solid-js";

export default function PatchBay() {
	const sources = useAppSelector(selectConnectableSources);
	const targets = useAppSelector(selectConnectableTargets);

	return (
		<div class="w-full">
			<ErrorBoundary fallback={(e) => <ErrorMessage>{String(e)}</ErrorMessage>}>
				<tbody>
					<tr>
						<SourceLabel title="To / From">To / From</SourceLabel>
						<For each={sources()}>
							{(source) => (
								<SourceLabel title={`From ${source.label} to ...`}>
									{source.label}
								</SourceLabel>
							)}
						</For>
					</tr>
					<For each={targets()}>
						{(target) => (
							<tr>
								<TargetLabel title={`From ... to ${target.label}`}>
									{target.label}
								</TargetLabel>
								<For each={sources()}>
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
}

function SourceLabel(props: ParentProps<{ title: string }>) {
	return (
		<th
			title={props.title}
			class="max-w-[5.4em] truncate pe-[0.4em] text-center text-[0.68em] font-normal first-of-type:text-start"
		>
			{props.children}
		</th>
	);
}

function TargetLabel(props: ParentProps<{ title: string }>) {
	return (
		<td
			title={props.title}
			class="max-w-[5.4em] truncate pb-[0.4em] text-center text-[0.68em] font-normal first-of-type:text-start [&:not(:first-of-type)]:p-0"
		>
			{props.children}
		</td>
	);
}
