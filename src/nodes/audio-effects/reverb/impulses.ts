import impulseWide from "./impulse-wide.wav";
import impulseTight from "./impulse-tight.wav";

export type ImpulseName = keyof typeof impulseUrls;

export const loadImpulse = async (
	audioContext: AudioContext,
	name: ImpulseName,
) => {
	const response = await fetch(impulseUrls[name]);
	const arrayBuffer = await response.arrayBuffer();

	return audioContext.decodeAudioData(arrayBuffer);
};

const impulseUrls = {
	wide: impulseWide,
	tight: impulseTight,
};
