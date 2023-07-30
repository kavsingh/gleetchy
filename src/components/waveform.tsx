import { useRef, useEffect, memo } from "react";

import { useAppSelector } from "~/app-store/hooks/base";
import { selectTheme } from "~/app-store/ui/selectors";

export default memo(function Waveform({
	timeRegions,
	buffer,
}: WaveformProps & { className?: string | undefined }) {
	const theme = useAppSelector(selectTheme);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const handleResize = () => {
			const canvas = canvasRef.current;

			if (!canvas) return;

			canvas.setAttribute("data-theme", theme);
			updateWaveform(canvas, {
				timeRegions,
				buffer,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				pixelRatio: globalThis.window.devicePixelRatio ?? 1,
			});
		};

		handleResize();
		globalThis.window.addEventListener("resize", handleResize);

		return () => {
			globalThis.window.removeEventListener("resize", handleResize);
		};
	}, [timeRegions, buffer, theme]);

	return (
		<div className="h-full w-full overflow-hidden">
			<canvas
				className={"h-full w-full border-0 border-text100 text-text600"}
				ref={canvasRef}
			/>
		</div>
	);
});

function drawTempWaveform(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
) {
	context.fillRect(0, height / 2, width, 1);
}

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
	{
		pixelRatio = 1,
		timeRegions = 4,
		buffer,
	}: WaveformProps & { pixelRatio: number },
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

export type WaveformProps = {
	buffer: Nullable<AudioBuffer>;
	timeRegions?: number | undefined;
};
