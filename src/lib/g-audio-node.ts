export abstract class GAudioNode<
	P extends Record<string, unknown> = Record<string, unknown>,
> {
	protected props: P;
	private inputGainNode: AudioNode;
	private outputGainNode: AudioNode;

	abstract type: string;

	constructor(
		protected audioContext: AudioContext,
		initialProps: P,
	) {
		this.props = { ...initialProps };
		this.inputGainNode = audioContext.createGain();
		this.outputGainNode = audioContext.createGain();
	}

	get inNode(): AudioNode {
		return this.inputGainNode;
	}

	get outNode(): AudioNode {
		return this.outputGainNode;
	}

	static async getWorklets(): Promise<string[]> {
		return Promise.resolve([]);
	}

	connect(node: AudioNode | GAudioNode): void {
		if (node instanceof AudioNode) {
			this.outputGainNode.connect(node);
		} else if (node instanceof GAudioNode) {
			this.outputGainNode.connect(node.inputGainNode);
		} else {
			throw new Error("Unable to connect to node");
		}
	}

	disconnect(node?: AudioNode | GAudioNode): void {
		if (!node) {
			this.outputGainNode.disconnect();
		} else if (node instanceof AudioNode) {
			this.outputGainNode.disconnect(node);
		} else if (node instanceof GAudioNode) {
			this.outputGainNode.disconnect(node.inputGainNode);
		} else {
			throw new Error("Unable to disconnect node");
		}
	}

	set(nextProps: Partial<P>): void {
		const previousProps = { ...this.props };

		Object.assign(this.props, nextProps);

		this.propsUpdated(this.props, previousProps);
	}

	abstract destroy(): void;

	protected abstract propsUpdated(props: P, previousProps: P): void;
}

export abstract class GInstrumentNode<
	P extends Record<string, unknown> = Record<string, unknown>,
	S extends Record<string, unknown> = Record<string, unknown>,
> extends GAudioNode<P> {
	private subscribers = new Set<GInstrumentNodeSubscriber<S>>();

	subscribe(subscriber: GInstrumentNodeSubscriber<S>): () => void {
		this.subscribers.add(subscriber);

		return () => {
			this.subscribers.delete(subscriber);
		};
	}

	protected notifySubscribers = (state: S) => {
		for (const subscriber of this.subscribers) {
			subscriber(state);
		}
	};

	abstract play(): void;

	abstract stop(): void;
}

type GInstrumentNodeSubscriber<S> = (state: S) => unknown;
