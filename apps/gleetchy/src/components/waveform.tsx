import { createEffect, onCleanup } from "solid-js";

import { useAppSelector } from "#app-store/hooks/base";
import { selectTheme } from "#app-store/ui/selectors";

import { useResizeObserver } from "./hooks/use-resize-observer";

export function Waveform(props: Props) {
	const theme = useAppSelector(selectTheme);
	const observe = useResizeObserver();
	let unobserve: ReturnType<typeof observe> | undefined = undefined;
	let canvasRef: HTMLCanvasElement | undefined = undefined;

	function update() {
		if (!canvasRef) return;

		canvasRef.dataset["theme"] = theme();
		updateWaveform(canvasRef, {
			timeRegions: props.timeRegions,
			buffer: props.buffer,
			pixelRatio: globalThis.window.devicePixelRatio,
		});
	}

	createEffect(update);

	onCleanup(() => {
		unobserve?.();
	});

	return (
		<div class="size-full overflow-hidden">
			<canvas
				class="size-full border-0 border-emphasis-100 text-emphasis-600"
				ref={(el) => {
					canvasRef = el;
					unobserve = observe(el, update);
				}}
			/>
		</div>
	);
}

export interface WaveformProps {
	buffer: AudioBuffer | undefined;
	timeRegions?: number | undefined;
}

interface Props extends WaveformProps {
	class?: string | undefined;
}

function drawTempWaveform(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
) {
	context.fillRect(0, height / 2, width, 1);
}

// oxlint-disable-next-line max-params
function drawTimeRegions(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	timeRegions: number,
) {
	for (let i = 0; i < timeRegions; i++) {
		const x = Math.round(i * 0.25 * width);

		context.moveTo(x, 0);
		context.lineTo(x, height);
	}

	context.stroke();
}

// oxlint-disable-next-line max-params
function drawWaveform(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	buffer: AudioBuffer,
) {
	const buffStep = buffer.length / width;
	const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => {
		return buffer.getChannelData(i);
	});
	const channelHeight = height / channels.length;
	const mids = channels.map((_, i) => (i + 0.5) * channelHeight);
	const valueMult = channelHeight / 2;

	for (let x = 0; x < width; x++) {
		const sampleIndex = Math.floor(x * buffStep);

		for (let c = 0; c < channels.length; c++) {
			const val = (channels[c]?.[sampleIndex] ?? 0) * valueMult;
			const mid = mids[c] ?? 0;

			context.fillRect(x, mid - val, 1, val * 2);
		}
	}
}

function updateWaveform(
	canvasNode: HTMLCanvasElement,
	{ pixelRatio, timeRegions = 4, buffer }: UpdateWaveformOptions,
) {
	const context = canvasNode.getContext("2d");

	if (!context) return;

	const style = getComputedStyle(canvasNode);
	const width = canvasNode.offsetWidth;
	const height = canvasNode.offsetHeight;

	canvasNode.width = width * pixelRatio;
	canvasNode.height = height * pixelRatio;

	context.scale(pixelRatio, pixelRatio);
	context.clearRect(0, 0, width, height);
	context.fillStyle = style.color;
	context.strokeStyle = style.borderColor;

	if (buffer) {
		drawTimeRegions(context, width, height, timeRegions);
		drawWaveform(context, width, height, buffer);
	} else {
		drawTempWaveform(context, width, height);
	}
}

interface UpdateWaveformOptions extends WaveformProps {
	pixelRatio: number;
}
