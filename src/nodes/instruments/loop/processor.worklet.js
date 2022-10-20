// Vite production build incorrectly handle ts files imported via ?url
// TODO: Convert back to typescript once https://github.com/vitejs/vite/issues/6979 is resolved

class LoopProcessor extends AudioWorkletProcessor {
	// keepAlive = true;

	constructor() {
		super();
		this.keepAlive = true;
		// this.port.onmessage = (message: MessageEvent<string>) => {
		this.port.onmessage = (message) => {
			if (message.data === "kill") this.keepAlive = false;
		};
	}

	// process(inputList: InputList) {
	process(inputList) {
		// const position = inputList[0]?.[0]?.[0];
		// _fuck_
		const position = ((inputList[0] || [])[0] || [])[0];

		if (Number.isFinite(position)) this.port.postMessage(position);

		return this.keepAlive;
	}
}

registerProcessor("loop-processor", LoopProcessor);

export {};

// type InputList = Float32Array[][];
