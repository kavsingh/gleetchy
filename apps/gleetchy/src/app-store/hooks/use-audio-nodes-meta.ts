import {
	selectInstrumentsIdentifierMeta,
	selectAudioEffectsIdentifierMeta,
} from "~/app-store/audio-nodes/selectors";

import { useAppSelector } from "./base";

export default function useAudioNodesMeta() {
	const instruments = useAppSelector(selectInstrumentsIdentifierMeta);
	const audioEffects = useAppSelector(selectAudioEffectsIdentifierMeta);

	return { instruments, audioEffects } as const;
}
