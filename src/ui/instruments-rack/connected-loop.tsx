import { Show } from "solid-js";

import {
	receiveAudioFile as receiveAudioFileAction,
	selectAudioFile as selectAudioFileAction,
} from "~/app-store/audio-files/actions";
import { useAppDispatch } from "~/app-store/hooks/base";
import useAudioNode, {
	validateNodeType,
} from "~/app-store/hooks/use-audio-node";
import NodeWrapper from "~/components/node-wrapper";
import { nodeType, UI } from "~/nodes/instruments/loop";

import type { NodeProps as Eq3Props } from "~/nodes/audio-effects/eq3";
import type { NodeProps } from "~/nodes/instruments/loop";

export default function ConnectedLoop(props: { id: string }) {
	const {
		label,
		connections,
		audioProps,
		isActive,
		updateAudioProps,
		updateLabel,
		duplicate,
		remove,
		// eslint-disable-next-line solid/reactivity
	} = useAudioNode<NodeProps>(props.id, validateNodeType(nodeType));

	const dispatch = useAppDispatch();

	function receiveAudioFile(file: File) {
		void dispatch(receiveAudioFileAction({ id: props.id, file }));
	}

	function selectAudioFile() {
		void dispatch(selectAudioFileAction({ id: props.id }));
	}

	function handleGainChange(gain: number) {
		updateAudioProps({ gain });
	}

	function handlePlaybackRateChange(playbackRate: number) {
		updateAudioProps({ playbackRate });
	}

	function handleEqChange(eqProps: Eq3Props) {
		updateAudioProps(eqProps);
	}

	function handleLoopRegionChange(loopStart: number, loopEnd: number) {
		updateAudioProps({ loopStart, loopEnd });
	}

	return (
		<Show when={audioProps()}>
			{(audio) => (
				<NodeWrapper isActive={isActive()}>
					<UI
						nodeId={props.id}
						loopStart={audio().loopStart}
						loopEnd={audio().loopEnd}
						label={label() ?? ""}
						fileName={audio().fileName}
						connections={connections()}
						isActive={isActive()}
						highGain={audio().highGain}
						midGain={audio().midGain}
						lowGain={audio().lowGain}
						playbackRate={audio().playbackRate}
						gain={audio().gain}
						audioBuffer={audio().audioBuffer}
						onGainChange={handleGainChange}
						onPlaybackRateChange={handlePlaybackRateChange}
						onEqChange={handleEqChange}
						selectAudioFile={selectAudioFile}
						receiveAudioFile={receiveAudioFile}
						onLoopRegionChange={handleLoopRegionChange}
						onLabelChange={updateLabel}
						duplicate={duplicate}
						remove={remove}
					/>
				</NodeWrapper>
			)}
		</Show>
	);
}
