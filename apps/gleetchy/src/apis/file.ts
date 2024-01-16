let fileInput: HTMLInputElement | undefined;

function getFileInput() {
	if (!fileInput) {
		fileInput = globalThis.document.createElement("input");
		fileInput.setAttribute("type", "file");
		fileInput.setAttribute("accept", ".wav, .mp3, .ogg");
		globalThis.document.body.appendChild(fileInput);
		fileInput.style.display = "none";
	}

	return fileInput;
}

export function loadAudioFilesFromInput() {
	const input = getFileInput();

	return new Promise<File[]>((resolve, reject) => {
		input.onchange = function audioFileInputChanged() {
			const { files } = input;

			if (!files) {
				resolve([]);

				return;
			}

			resolve(
				Array.from(files).filter(({ type }) => type.startsWith("audio/")),
			);

			input.value = "";
		};

		input.onerror = function audioFileInputError(cause) {
			const error =
				typeof cause === "string"
					? new Error(cause)
					: new Error("Could not load audio file");

			reject(error);

			input.value = "";
		};

		input.click();
	});
}
