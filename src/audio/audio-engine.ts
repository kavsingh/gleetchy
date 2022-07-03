import { pick, tryCatch } from "ramda";
import { isAnyOf } from "@reduxjs/toolkit";

import { warn } from "~/lib/dev";
import { noop } from "~/lib/util";
import { isInstrumentNode } from "~/lib/audio";
import { MAIN_OUT_ID } from "~/constants/audio";
import {
	createAudioNode as createDelayNode,
	nodeType as delayType,
} from "~/nodes/audio-effects/delay";
import {
	createAudioNode as createReverbNode,
	nodeType as reverbType,
} from "~/nodes/audio-effects/reverb";
import {
	createAudioNode as createLoopNode,
	nodeType as loopType,
} from "~/nodes/instruments/loop";
import { GAudioNode } from "~/lib/g-audio-node";
import { togglePlayback } from "~/app-store/global-playback/actions";
import {
	addConnection,
	removeConnection,
	toggleConnection,
} from "~/app-store/connections/actions";
import {
	addAudioNode,
	duplicateAudioNode,
	removeAudioNode,
	updateAudioNodeProps,
} from "~/app-store/audio-nodes/actions";
import { decodeAudioFile } from "~/app-store/audio-files/actions";
import { GLoopNode } from "~/nodes/instruments/loop/create-audio-node";
import { GDelayNode } from "~/nodes/audio-effects/delay/create-audio-node";
import { GReverbNode } from "~/nodes/audio-effects/reverb/create-audio-node";

import type { AnyAction } from "@reduxjs/toolkit";
import type { AppState } from "~/app-store/configure-store";
import type { GInstrumentNode } from "~/lib/g-audio-node";
import type { AudioNodeState } from "~/types";

export default class AudioEngine {
	private publishSubscriptionEvent: SubscriptionEventDispatcher;
	private audioNodes: Record<string, GAudioNode | GInstrumentNode | AudioNode> =
		{};
	private subscriptions: Record<string, () => void> = {};
	private audioContext?: AudioContext;
	private workletsLoaded = false;

	public constructor({
		publishSubscriptionEvent,
	}: {
		publishSubscriptionEvent: SubscriptionEventDispatcher;
	}) {
		this.publishSubscriptionEvent = publishSubscriptionEvent;
	}

	public update = async (appState: AppState, action: AnyAction) => {
		const didUpdate = await this.updateAudioContext(
			appState.audioContext.audioContext,
		);

		if (!(this.audioContext && this.workletsLoaded)) return;

		const updateNodes = () =>
			this.updateAudioNodes(
				appState.audioNodes.byId,
				appState.globalPlayback.isPlaying,
			);

		const updateGraph = () => this.updateAudioGraph(appState.connections);

		if (didUpdate) {
			updateNodes();
			updateGraph();

			return;
		}

		if (isAnyOf(togglePlayback)(action)) {
			this.forEachInstrument((instrument) =>
				this.toggleInstrumentPlaybackAndSubscription(
					instrument,
					appState.globalPlayback.isPlaying,
				),
			);

			return;
		}

		if (isAnyOf(addConnection, removeConnection, toggleConnection)(action)) {
			updateGraph();

			return;
		}

		if (isAnyOf(addAudioNode, duplicateAudioNode)(action)) {
			updateNodes();
			updateGraph();

			return;
		}

		if (isAnyOf(removeAudioNode)(action)) {
			const id = action.payload;
			const node = this.audioNodes[id];

			if (!node) return;

			if (isInstrumentNode(node)) this.stopAndUnsubscribeInstrument(node);

			if (node instanceof GAudioNode) {
				try {
					node.destroy();
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e);
				}
			}

			if (!appState.audioNodes.byId[id]) delete this.audioNodes[id];

			this.updateAudioGraph(appState.connections);

			return;
		}

		if (isAnyOf(updateAudioNodeProps)(action)) {
			this.updateNode(action.payload);

			return;
		}

		if (isAnyOf(decodeAudioFile.fulfilled)(action)) {
			const { id, file } = action.payload;

			this.updateNode({ id, audioProps: { ...file } });
		}
	};

	// TODO: clean this shit up
	private updateAudioContext = async (
		nextContext: AppState["audioContext"]["audioContext"],
	) => {
		if (!nextContext || this.audioContext === nextContext) return false;

		this.audioContext = nextContext;
		await this.loadWorklets();

		return true;
	};

	private loadWorklets = async () => {
		this.workletsLoaded = false;

		if (!this.audioContext) return;

		await registerWorklets(this.audioContext);
		this.workletsLoaded = true;
	};

	private getInstrumentNodes = (): GInstrumentNode[] => {
		return Object.values(this.audioNodes).filter(isInstrumentNode);
	};

	private forEachInstrument = (fn: InstrumentNodeProcessor) => {
		this.getInstrumentNodes().forEach(fn);
	};

	private getNodeId = (node: GAudioNode | GInstrumentNode | AudioNode) =>
		Object.entries(this.audioNodes).find(
			([, registeredNode]) => registeredNode === node,
		)?.[0];

	private playAndSubscribeInstrument = (node: GInstrumentNode) => {
		const nodeId = this.getNodeId(node);

		if (nodeId) {
			this.subscriptions[nodeId]?.();

			if (typeof node.subscribe === "function") {
				this.subscriptions[nodeId] = node.subscribe((payload: unknown) =>
					this.publishSubscriptionEvent(nodeId, payload),
				);
			}
		}

		node.play();
	};

	private stopAndUnsubscribeInstrument = (node: GInstrumentNode) => {
		const nodeId = this.getNodeId(node);

		if (nodeId) {
			this.subscriptions[nodeId]?.();
			delete this.subscriptions[nodeId];
		}

		node.stop();
	};

	private toggleInstrumentPlaybackAndSubscription = (
		node: GInstrumentNode,
		isPlaying: boolean,
	) => {
		if (isPlaying) this.playAndSubscribeInstrument(node);
		else this.stopAndUnsubscribeInstrument(node);
	};

	private disconnectAllNodes() {
		Object.values(this.audioNodes).forEach(
			// Safari crashes if node not connected
			tryCatch<AudioNodeEffect>((node) => {
				node.disconnect();
			}, noop),
		);
	}

	private updateAudioNodes(
		nodes: AppState["audioNodes"]["byId"],
		isPlaying: AppState["globalPlayback"]["isPlaying"],
	) {
		if (!this.audioContext) return;

		const nextNodeIds = Object.keys(nodes);

		this.audioNodes = Object.entries(this.audioNodes).length
			? pick(nextNodeIds, this.audioNodes)
			: { [MAIN_OUT_ID]: this.audioContext.destination };

		nextNodeIds
			.filter((id) => !this.audioNodes[id])
			.forEach((id) => {
				if (!this.audioContext) return;

				const node = nodes[id];

				if (!node) return;

				const newNode = createNewNode(this.audioContext, node);

				if (!newNode) return;

				this.audioNodes[node.id] = newNode;

				if (isPlaying && isInstrumentNode(newNode)) {
					this.playAndSubscribeInstrument(newNode);
				}
			});
	}

	private updateAudioGraph(connections: AppState["connections"]) {
		this.disconnectAllNodes();

		if (!connections.length) return;

		connections.forEach(({ from, to }) => {
			const fromNode = this.audioNodes[from];
			const toNode = this.audioNodes[to];

			if (fromNode && toNode) (fromNode as GAudioNode).connect(toNode);
		});
	}

	private updateNode({
		id,
		audioProps,
	}: {
		id: string;
		audioProps: Record<string, unknown>;
	}) {
		const node = this.audioNodes[id];

		if (!node) return;

		setNodeProps({ node, audioProps });
	}
}

const setNodeProps = tryCatch<TrySet>(({ node, audioProps }) => {
	const target = node as GAudioNode;

	if (typeof target.set === "function") target.set(audioProps);
}, warn);

const createNewNode = (
	context: AudioContext,
	state: AudioNodeState<Record<string, unknown>>,
): GAudioNode | GInstrumentNode | undefined => {
	switch (state.type) {
		case delayType:
			return createDelayNode(context, state.audioProps);
		case reverbType:
			return createReverbNode(context, state.audioProps);
		case loopType:
			return createLoopNode(context, state.audioProps);
		default:
			return;
	}
};

const registerWorklets = async (context: AudioContext) => {
	const sources = (
		await Promise.all([
			GLoopNode.getWorklets(),
			GDelayNode.getWorklets(),
			GReverbNode.getWorklets(),
		])
	).flat();

	await Promise.all(
		sources.map((source) => context.audioWorklet.addModule(source)),
	);
};

type AudioEngineNode = AudioNode | GAudioNode | GInstrumentNode;

type AudioNodeEffect = (node: AudioNode | GAudioNode) => void;

type InstrumentNodeProcessor = (node: GInstrumentNode) => void;

type TrySet = (args: {
	node: AudioEngineNode;
	audioProps: Record<string, unknown>;
}) => void;

type SubscriptionEventDispatcher = (nodeId: string, payload: unknown) => void;
