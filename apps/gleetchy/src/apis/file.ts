let fileInput: HTMLInputElement | undefined = undefined;

function getFileInput() {
	if (!fileInput) {
		fileInput = globalThis.document.createElement("input");
		fileInput.setAttribute("type", "file");
		fileInput.setAttribute("accept", ".wav, .mp3, .ogg");
		globalThis.document.body.append(fileInput);
		fileInput.style.display = "none";
	}

	return fileInput;
}

export function loadAudioFilesFromInput() {
	const input = getFileInput();

	// oxlint-disable-next-line avoid-new
	return new Promise<File[]>((resolve, reject) => {
		function handleAudioFileInputChanged() {
			input.removeEventListener("change", handleAudioFileInputChanged);
			input.removeEventListener("error", handleAudioFileInputError);

			const { files } = input;

			if (!files) {
				resolve([]);

				return;
			}

			resolve(
				// oxlint-disable-next-line prefer-spread FileList has no symbol.iterator
				Array.from(files).filter(({ type }) => type.startsWith("audio/")),
			);

			input.value = "";
		}

		function handleAudioFileInputError(event: ErrorEvent) {
			input.removeEventListener("change", handleAudioFileInputChanged);
			input.removeEventListener("error", handleAudioFileInputError);

			reject(new Error(`Could not load audio file: ${String(event.error)}`));

			input.value = "";
		}

		input.addEventListener("change", handleAudioFileInputChanged);
		input.addEventListener("error", handleAudioFileInputError);
		input.click();
	});
}
