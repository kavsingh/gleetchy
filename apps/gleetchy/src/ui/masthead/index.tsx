import { GithubLogo } from "./github-logo";
import { PlayPauseButton } from "./play-pause-button";
import { ThemeSelect } from "./theme-select";

export function Masthead() {
	return (
		<div class="flex items-center justify-between inline-full">
			<PlayPauseButton />
			<div class="flex flex-nowrap items-center gap-2 self-stretch">
				<ThemeSelect />
				<a
					href="https://www.github.com/kavsingh/gleetchy"
					target="_blank"
					rel="noopener noreferrer"
					title="view on github"
					class="opacity-40 transition-opacity hover:opacity-100 focus:opacity-100 focus-visible:opacity-100"
				>
					<GithubLogo class="block-3.75 inline-3.75" />
				</a>
			</div>
		</div>
	);
}
