import type { AudioFileData } from "~/types";

let fileInput: HTMLInputElement | undefined;

function getFileInput() {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!globalThis?.document) return undefined;

	if (!fileInput) {
		fileInput = globalThis.document.createElement("input");
		fileInput.setAttribute("type", "file");
		fileInput.setAttribute("accept", ".wav, .mp3, .ogg");
		globalThis.document.body.appendChild(fileInput);
		fileInput.style.display = "none";
	}

	return fileInput;
}

export function loadAudioFiles() {
	const input = getFileInput();

	if (!input) return Promise.reject(new Error("Cannot load files"));

	return new Promise<File[]>((resolve, reject) => {
		input.onchange = () => {
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

		input.onerror = (error) => {
			reject(error);

			input.value = "";
		};

		input.click();
	});
}

export async function readFileToArrayBuffer(
	file: File,
): Promise<AudioFileData> {
	const buffer = await file.arrayBuffer();

	return { buffer, fileName: file.name, fileType: file.type };
}

export async function loadAudioFilesToArrayBuffers() {
	const files = await loadAudioFiles();

	return Promise.all(files.map(readFileToArrayBuffer));
}
