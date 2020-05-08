export abstract class GAudioNode<P extends object = {}> {
  protected inNode: AudioNode
  protected outNode: AudioNode
  protected defaultProps: P = {} as P
  protected props: P

  abstract type: string

  constructor(protected audioContext: AudioContext, initialProps: Partial<P>) {
    this.props = { ...this.defaultProps, ...initialProps }
    this.inNode = this.audioContext.createGain()
    this.outNode = this.audioContext.createGain()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connect(node: AudioNode | GAudioNode<any>) {
    if (node instanceof AudioNode) this.outNode.connect(node)
    else if (node instanceof GAudioNode) this.outNode.connect(node.inNode)
    else throw new Error('Unable to connect to node')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disconnect(node?: AudioNode | GAudioNode<any>) {
    if (!node) this.outNode.disconnect()
    else if (node instanceof AudioNode) this.outNode.disconnect(node)
    else if (node instanceof GAudioNode) this.outNode.disconnect(node.inNode)
    else throw new Error('Unable to disconnect node')
  }

  set(nextProps: Partial<P>) {
    const previousProps = { ...this.props }

    Object.assign(this.props, nextProps)

    this.propsUpdated(this.props, previousProps)
  }

  protected abstract propsUpdated(props: P, previousProps: P): void

  abstract destroy(): void
}

type GInstrumentNodeSubscriber<S> = (state: S) => unknown

export abstract class GInstrumentNode<
  P extends object = {},
  S extends object = {}
> extends GAudioNode<P> {
  private subscribers: GInstrumentNodeSubscriber<S>[] = []

  subscribe(subscriber: GInstrumentNodeSubscriber<S>) {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber)
    }

    return () => {
      const idx = this.subscribers.indexOf(subscriber)

      if (idx !== -1) this.subscribers.splice(idx, 1)
    }
  }

  protected notifySubscribers(state: S) {
    this.subscribers.forEach((subscriber) => {
      subscriber(state)
    })
  }

  abstract play(): void

  abstract stop(): void
}
