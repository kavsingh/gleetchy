import { useCallback, memo } from "react";

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

export default memo(function ConnectedLoop({ id }: { id: string }) {
	const {
		label,
		connections,
		audioProps,
		isActive,
		updateAudioProps,
		updateLabel,
		duplicate,
		remove,
	} = useAudioNode<NodeProps>(id, validateNodeType(nodeType));

	const dispatch = useAppDispatch();

	const receiveAudioFile = useCallback(
		(file: File) => {
			void dispatch(receiveAudioFileAction({ id, file }));
		},
		[id, dispatch],
	);

	const selectAudioFile = useCallback(() => {
		void dispatch(selectAudioFileAction({ id }));
	}, [id, dispatch]);

	const handleGainChange = useCallback(
		(gain: number) => updateAudioProps({ gain }),
		[updateAudioProps],
	);

	const handlePlaybackRateChange = useCallback(
		(playbackRate: number) => updateAudioProps({ playbackRate }),
		[updateAudioProps],
	);

	const handleEqChange = useCallback(
		(eqProps: Eq3Props) => updateAudioProps(eqProps),
		[updateAudioProps],
	);

	const handleLoopRegionChange = useCallback(
		(loopStart: number, loopEnd: number) =>
			updateAudioProps({ loopStart, loopEnd }),
		[updateAudioProps],
	);

	return (
		<NodeWrapper isActive={isActive}>
			<UI
				nodeId={id}
				loopStart={audioProps.loopStart}
				loopEnd={audioProps.loopEnd}
				label={label}
				fileName={audioProps.fileName}
				connections={connections}
				isActive={isActive}
				highGain={audioProps.highGain}
				midGain={audioProps.midGain}
				lowGain={audioProps.lowGain}
				playbackRate={audioProps.playbackRate}
				gain={audioProps.gain}
				audioBuffer={audioProps.audioBuffer}
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
	);
});
