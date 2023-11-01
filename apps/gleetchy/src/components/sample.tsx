import { Match, Switch, createEffect, onCleanup } from "solid-js";

import LoopRegion from "~/components/loop-region";
import Waveform from "~/components/waveform";

export default function Sample(props: SampleProps) {
	let containerRef: HTMLDivElement | undefined;
	let playheadRef: HTMLDivElement | undefined;
	let unsubscribe: (() => void) | undefined;

	createEffect(() => {
		unsubscribe?.();
		unsubscribe = props.subscribeToPositionRatio?.((ratio) => {
			if (playheadRef) {
				playheadRef.style.transform = `translateX(${ratio * 100}%)`;
			}
		});
	});

	onCleanup(() => {
		unsubscribe?.();
	});

	return (
		<div class="relative h-full w-full" ref={containerRef}>
			<div class="absolute inset-0 z-[1]">
				<Waveform buffer={props.audioBuffer} />
			</div>
			<Switch>
				<Match when={!!props.audioBuffer}>
					<>
						<div class="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
							<div
								class="pointer-events-none absolute inset-0 z-[2] before:absolute before:inset-y-0 before:left-0 before:w-[1px] before:bg-text600"
								ref={playheadRef}
							/>
						</div>
						<div class="absolute inset-0 z-[3]">
							<LoopRegion
								loopStart={props.loopStart ?? 0}
								loopEnd={props.loopEnd ?? 1}
								onLoopStartDrag={props.onLoopStartDrag}
								onLoopEndDrag={props.onLoopEndDrag}
								onLoopRegionDrag={props.onLoopRegionDrag}
							/>
						</div>
					</>
				</Match>
				<Match when={!props.audioBuffer}>
					<button
						class="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 bg-surface0 p-12"
						tabIndex={0}
						onClick={() => props.selectAudioFile?.()}
					>
						<Switch fallback={"Click to load audio file or drag it here"}>
							<Match when={props.fromSaved}>
								<>
									<span class="text-center">
										Unfortunately audio data is not saved with a project
									</span>
									<span class="text-center">
										Click here (or drag and drop) to load files again
									</span>
								</>
							</Match>
						</Switch>
					</button>
				</Match>
			</Switch>
		</div>
	);
}

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
