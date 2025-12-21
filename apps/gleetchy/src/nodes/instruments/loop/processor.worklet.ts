class LoopProcessor extends AudioWorkletProcessor {
	keepAlive = true;

	constructor() {
		super();
		this.port.addEventListener("message", (message) => {
			if (message.data === "kill") this.keepAlive = false;
		});
	}

	process(inputList: InputList) {
		const position = inputList[0]?.[0]?.[0];

		if (Number.isFinite(position)) this.port.postMessage(position, {});

		return this.keepAlive;
	}
}

registerProcessor("loop-processor", LoopProcessor);

// oxlint-disable-next-line require-module-specifiers
export {};

type InputList = Float32Array[][];
