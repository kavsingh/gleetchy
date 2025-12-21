import {
	selectInstrumentsIdentifierMeta,
	selectAudioEffectsIdentifierMeta,
} from "#app-store/audio-nodes/selectors";

import { useAppSelector } from "./base";

export function useAudioNodesMeta() {
	const instruments = useAppSelector(selectInstrumentsIdentifierMeta);
	const audioEffects = useAppSelector(selectAudioEffectsIdentifierMeta);

	return { instruments, audioEffects } as const;
}
