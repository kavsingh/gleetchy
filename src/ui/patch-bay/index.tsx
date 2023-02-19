import { memo, useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import {
	selectConnectableSources,
	selectConnectableTargets,
} from "~/app-store/audio-nodes/selectors";
import ErrorBoundary from "~/components/error-boundary";
import { useAppSelector } from "~/app-store/hooks/base";

import PatchBayNode from "./patch-bay-node";

export default memo(function PatchBay() {
	const sources = useAppSelector(selectConnectableSources);
	const targets = useAppSelector(selectConnectableTargets);

	const sourceLabels = useMemo(
		() => (
			<Row key="source-labels">
				<SourceLabel>To / From</SourceLabel>
				{sources.map((source) => (
					<SourceLabel title={`From ${source.label} to ...`} key={source.id}>
						{source.label}
					</SourceLabel>
				))}
			</Row>
		),
		[sources],
	);

	return (
		<div className="is-full">
			<ErrorBoundary>
				<tbody>
					{sourceLabels}
					{targets.map((target) => (
						<Row key={target.id}>
							<TargetLabel title={`From ... to ${target.label}`} key="rowLabel">
								{target.label}
							</TargetLabel>
							{sources.map((source) => (
								<td key={`${source.id}-${target.id}`}>
									<PatchBayNode source={source} target={target} />
								</td>
							))}
						</Row>
					))}
				</tbody>
			</ErrorBoundary>
		</div>
	);
});

const labelStyle = css`
	max-inline-size: 5.4em;
	overflow: hidden;
	font-weight: 400;
	font-size: 0.68em;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const Row = styled.tr`
	th,
	td {
		text-align: center;
	}

	th {
		padding: 0 0 0.4em;
	}

	td {
		padding: 0.4em 0;
	}

	th:first-of-type,
	td:first-of-type {
		text-align: left;
	}

	td:not(:first-of-type) {
		padding: 0 0.4em;
	}
`;

const SourceLabel = styled.th`
	${labelStyle}
`;

const TargetLabel = styled.td`
	${labelStyle}
`;
