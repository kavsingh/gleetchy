import { useMemo, memo } from "react";

import TitleBar from "~/components/title-bar";
import Button from "~/components/button";

import type { LoopUIProps } from "./types";

export default memo(function LoopTitleBar({
	label,
	onLabelChange,
	duplicate,
	remove,
	connections,
	fileName,
	audioBuffer,
	selectAudioFile,
}: Props) {
	const fileInfo = useMemo(
		() => (
			<>
				{fileName ? <span>{fileName}</span> : null}
				{fileName && audioBuffer ? (
					<span> - {audioBuffer.duration.toFixed(2)}s</span>
				) : null}
				{fileName ? <span>/</span> : null}
			</>
		),
		[audioBuffer, fileName],
	);

	const loadButton = useMemo(
		() => (
			<Button onClick={selectAudioFile}>
				{`${audioBuffer ? "Replace" : "Load"}`} audio file
			</Button>
		),
		[audioBuffer, selectAudioFile],
	);

	return (
		<TitleBar
			type="Loop"
			label={label}
			onLabelChange={onLabelChange}
			onRemoveClick={remove}
			connections={connections}
		>
			<div className="flex gap-1">
				{fileInfo}
				{loadButton}
				{audioBuffer ? <Button onClick={duplicate}>Clone</Button> : null}
			</div>
		</TitleBar>
	);
});

type Props = Pick<
	LoopUIProps,
	| "fileName"
	| "selectAudioFile"
	| "audioBuffer"
	| "label"
	| "onLabelChange"
	| "duplicate"
	| "remove"
	| "connections"
>;
