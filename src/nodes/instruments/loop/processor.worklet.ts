class LoopProcessor extends AudioWorkletProcessor {
  process(inputList: InputList) {
    const position = inputList[0]?.[0]?.[0]

    if (Number.isFinite(position)) this.port.postMessage(position)

    // goddamnit
    return true
  }
}

// @ts-expect-error keine ahnung
registerProcessor('loop-processor', LoopProcessor)

export {}

type InputList = Float32Array[][]
