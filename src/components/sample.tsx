import { memo, useEffect, useMemo, useRef } from "react";

import LoopRegion from "~/components/loop-region";
import Waveform from "~/components/waveform";

export default memo(function Sample({
	audioBuffer,
	subscribeToPositionRatio,
	onLoopStartDrag,
	onLoopEndDrag,
	onLoopRegionDrag,
	selectAudioFile,
	loopStart = 0,
	loopEnd = 1,
	fromSaved = false,
}: SampleProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const playheadRef = useRef<HTMLDivElement | null>(null);

	const waveForm = useMemo(
		() => <Waveform buffer={audioBuffer} />,
		[audioBuffer],
	);

	const loopRegion = useMemo(
		() => (
			<LoopRegion
				loopStart={loopStart}
				loopEnd={loopEnd}
				onLoopStartDrag={onLoopStartDrag}
				onLoopEndDrag={onLoopEndDrag}
				onLoopRegionDrag={onLoopRegionDrag}
			/>
		),
		[loopStart, loopEnd, onLoopStartDrag, onLoopEndDrag, onLoopRegionDrag],
	);

	useEffect(
		() =>
			subscribeToPositionRatio?.((ratio) => {
				if (!playheadRef.current) return;

				playheadRef.current.style.transform = `translateX(${ratio * 100}%)`;
			}),
		[subscribeToPositionRatio],
	);

	return (
		<div className="relative h-full w-full" ref={containerRef}>
			<div className="absolute inset-0 z-[1]">{waveForm}</div>
			{audioBuffer ? (
				<>
					<div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
						<div
							className="pointer-events-none absolute inset-0 z-[2] before:absolute before:inset-y-0 before:left-0 before:w-[1px] before:bg-text600"
							ref={playheadRef}
						/>
					</div>
					<div className="absolute inset-0 z-[3]">{loopRegion}</div>
				</>
			) : (
				<button
					className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 bg-surface0 p-12"
					tabIndex={0}
					onClick={selectAudioFile}
				>
					{fromSaved
						? [
								<span className="text-center" key="a">
									Unfortunately audio data is not saved with a project
								</span>,
								<span className="text-center" key="b">
									Click here (or drag and drop) to load files again
								</span>,
						  ]
						: "Click to load audio file or drag it here"}
				</button>
			)}
		</div>
	);
});

export type SampleProps = {
	audioBuffer: Nullable<AudioBuffer>;
	fromSaved?: boolean | undefined;
	loopStart?: number | undefined;
	loopEnd?: number | undefined;
	onLoopStartDrag?: ((movement: number) => unknown) | undefined;
	onLoopEndDrag?: ((movement: number) => unknown) | undefined;
	onLoopRegionDrag?: ((movement: number) => unknown) | undefined;
	selectAudioFile?: (() => unknown) | undefined;
	subscribeToPositionRatio?:
		| ((handler: (ratio: number) => void) => () => void)
		| undefined;
};
