class LoopProcessor extends AudioWorkletProcessor {
	keepAlive = true;

	constructor() {
		super();
		this.port.onmessage = (message: MessageEvent<string>) => {
			if (message.data === "kill") this.keepAlive = false;
		};
	}

	process(inputList: InputList) {
		const position = inputList[0]?.[0]?.[0];

		if (Number.isFinite(position)) this.port.postMessage(position);

		return this.keepAlive;
	}
}

registerProcessor("loop-processor", LoopProcessor);

export {};

type InputList = Float32Array[][];
