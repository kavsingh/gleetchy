import { GithubLogo } from "./github-logo";
import PlayPauseButton from "./play-pause-button";
import ThemeSelect from "./theme-select";

export default function Masthead() {
	return (
		<div class="flex w-full items-center justify-between">
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
					<GithubLogo class="h-[15px] w-[15px]" />
				</a>
			</div>
		</div>
	);
}
