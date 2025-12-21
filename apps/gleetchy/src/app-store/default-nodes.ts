import { MAIN_OUT_ID } from "#constants/audio";
// oxlint-disable-next-line no-namespace
import * as delay from "#nodes/audio-effects/delay";
// oxlint-disable-next-line no-namespace
import * as reverb from "#nodes/audio-effects/reverb";
// oxlint-disable-next-line no-namespace
import * as loop from "#nodes/instruments/loop";

export const defaultNodes = [
	{
		id: MAIN_OUT_ID,
		label: "Main",
		audioProps: {},
		type: "AUDIO_CONTEXT",
	},
	{
		id: "loop-default0",
		label: "L0",
		audioProps: { ...loop.defaultProps },
		type: loop.nodeType,
	},
	{
		id: "loop-default1",
		label: "L1",
		audioProps: { ...loop.defaultProps },
		type: loop.nodeType,
	},
	{
		id: "delay-default0",
		label: "D0",
		audioProps: { ...delay.defaultProps },
		type: delay.nodeType,
	},
	{
		id: "delay-default1",
		label: "D1",
		audioProps: { ...delay.defaultProps },
		type: delay.nodeType,
	},
	{
		id: "reverb-default0",
		label: "R0",
		audioProps: { ...reverb.defaultProps },
		type: reverb.nodeType,
	},
	{
		id: "reverb-default1",
		label: "R1",
		audioProps: { ...reverb.defaultProps },
		type: reverb.nodeType,
	},
] as const;
