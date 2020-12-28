export abstract class GAudioNode<P = Record<string, unknown>> {
  private _inNode = this.audioContext.createGain()
  private _outNode = this.audioContext.createGain()
  protected defaultProps: P = {} as P
  protected props: P

  abstract type: string

  constructor(protected audioContext: AudioContext, initialProps: Partial<P>) {
    this.props = { ...this.defaultProps, ...initialProps }
  }

  connect(node: AudioNode | GAudioNode): void {
    if (node instanceof AudioNode) this._outNode.connect(node)
    else if (node instanceof GAudioNode) this._outNode.connect(node._inNode)
    else throw new Error('Unable to connect to node')
  }

  disconnect(node?: AudioNode | GAudioNode): void {
    if (!node) this._outNode.disconnect()
    else if (node instanceof AudioNode) this._outNode.disconnect(node)
    else if (node instanceof GAudioNode) this._outNode.disconnect(node._inNode)
    else throw new Error('Unable to disconnect node')
  }

  set(nextProps: Partial<P>): void {
    const previousProps = { ...this.props }

    Object.assign(this.props, nextProps)

    this.propsUpdated(this.props, previousProps)
  }

  get inNode(): AudioNode {
    return this._inNode
  }

  get outNode(): AudioNode {
    return this._outNode
  }

  protected abstract propsUpdated(props: P, previousProps: P): void

  abstract destroy(): void
}

type GInstrumentNodeSubscriber<S> = (state: S) => unknown

export abstract class GInstrumentNode<
  P = Record<string, unknown>,
  S = Record<string, unknown>
> extends GAudioNode<P> {
  private subscribers: GInstrumentNodeSubscriber<S>[] = []

  subscribe(subscriber: GInstrumentNodeSubscriber<S>): () => void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber)
    }

    return () => {
      const idx = this.subscribers.indexOf(subscriber)

      if (idx !== -1) this.subscribers.splice(idx, 1)
    }
  }

  protected notifySubscribers(state: S): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(state)
    })
  }

  abstract play(): void

  abstract stop(): void
}
