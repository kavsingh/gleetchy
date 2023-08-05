import Button from "~/components/button";
import TitleBar from "~/components/title-bar";

import type { LoopUIProps } from "./types";

export default function LoopTitleBar(props: Props) {
	return (
		<TitleBar
			type="Loop"
			label={props.label}
			onLabelChange={props.onLabelChange}
			onRemoveClick={props.remove}
			connections={props.connections}
		>
			<div class="flex gap-1">
				{props.fileName ? <span>{props.fileName}</span> : null}
				{props.fileName && props.audioBuffer ? (
					<span> - {props.audioBuffer.duration.toFixed(2)}s</span>
				) : null}
				{props.fileName ? <span>/</span> : null}
				<Button onClick={props.selectAudioFile}>
					{`${props.audioBuffer ? "Replace" : "Load"}`} audio file
				</Button>
				{props.audioBuffer ? (
					<Button onClick={props.duplicate}>Clone</Button>
				) : null}
			</div>
		</TitleBar>
	);
}

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
