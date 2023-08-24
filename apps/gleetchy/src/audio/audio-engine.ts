import { isAnyOf, isFulfilled } from "@reduxjs/toolkit";

import { loadAudioFileToNode } from "~/app-store/audio-files/actions";
import {
	addAudioNode,
	duplicateAudioNode,
	removeAudioNode,
	updateAudioNodeProps,
} from "~/app-store/audio-nodes/actions";
import {
	addConnection,
	removeConnection,
	toggleConnection,
} from "~/app-store/connections/actions";
import { togglePlayback } from "~/app-store/global-playback/actions";
import { MAIN_OUT_ID } from "~/constants/audio";
import { isInstrumentNode } from "~/lib/audio";
import { GAudioNode } from "~/lib/g-audio-node";
import { logError, logWarn } from "~/lib/log";
import {
	createAudioNode as createDelayNode,
	nodeType as delayType,
} from "~/nodes/audio-effects/delay";
import { GDelayNode } from "~/nodes/audio-effects/delay/create-audio-node";
import {
	createAudioNode as createReverbNode,
	nodeType as reverbType,
} from "~/nodes/audio-effects/reverb";
import { GReverbNode } from "~/nodes/audio-effects/reverb/create-audio-node";
import {
	createAudioNode as createLoopNode,
	nodeType as loopType,
} from "~/nodes/instruments/loop";
import { GLoopNode } from "~/nodes/instruments/loop/create-audio-node";

import type { AnyAction } from "@reduxjs/toolkit";
import type { AppState } from "~/app-store/create";
import type { GInstrumentNode } from "~/lib/g-audio-node";
import type { AudioNodeState } from "~/types";

export default class AudioEngine {
	private publishSubscriptionEvent: SubscriptionEventDispatcher;
	private audioNodes = new Map<
		string,
		GAudioNode | GInstrumentNode | AudioNode
	>();
	private unsubscribers = new Map<string, () => void>();
	private workletsLoaded = false;
	private audioContext?: AudioContext;

	public constructor({
		publishSubscriptionEvent,
	}: {
		publishSubscriptionEvent: SubscriptionEventDispatcher;
	}) {
		this.publishSubscriptionEvent = publishSubscriptionEvent;
	}

	public async update(appState: AppState, action: AnyAction) {
		const didUpdate = await this.updateAudioContext(
			appState.audioContext.audioContext,
		);

		if (!(this.audioContext && this.workletsLoaded)) return;

		const updateNodes = () => {
			this.updateAudioNodes(
				appState.audioNodes.byId,
				appState.globalPlayback.isPlaying,
			);
		};

		const updateGraph = () => {
			this.updateAudioGraph(appState.connections);
		};

		if (didUpdate) {
			updateNodes();
			updateGraph();

			return;
		}

		if (isAnyOf(togglePlayback)(action)) {
			this.forEachInstrument((instrument) => {
				this.toggleInstrumentPlaybackAndSubscription(
					instrument,
					appState.globalPlayback.isPlaying,
				);
			});

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
			const node = this.audioNodes.get(id);

			if (!node) return;

			if (isInstrumentNode(node)) this.stopAndUnsubscribeInstrument(node);

			if (node instanceof GAudioNode) {
				try {
					node.destroy();
				} catch (e) {
					logError(e);
				}
			}

			if (!appState.audioNodes.byId[id]) this.audioNodes.delete(id);

			this.updateAudioGraph(appState.connections);

			return;
		}

		if (isAnyOf(updateAudioNodeProps)(action)) {
			this.updateNode(action.payload);

			return;
		}

		if (isFulfilled(loadAudioFileToNode)(action)) {
			const { nodeId, file } = action.payload;
			const existing = this.audioNodes.get(nodeId);

			if (!(existing instanceof GLoopNode)) return;

			existing.set({
				fileName: file.name,
				fileType: file.type,
				audioBuffer: file.buffer,
			});
		}
	}

	// TODO: clean this shit up
	private async updateAudioContext(
		nextContext: AppState["audioContext"]["audioContext"],
	) {
		if (!nextContext || this.audioContext === nextContext) return false;

		this.audioContext = nextContext;
		await this.loadWorklets();

		return true;
	}

	private async loadWorklets() {
		this.workletsLoaded = false;

		if (!this.audioContext) {
			logWarn("attempted to load worklets without audio context");

			return;
		}

		await registerWorklets(this.audioContext);
		this.workletsLoaded = true;
	}

	private forEachInstrument(fn: InstrumentNodeProcessor) {
		for (const node of this.audioNodes.values()) {
			if (isInstrumentNode(node)) fn(node);
		}
	}

	private getNodeId(targetNode: GAudioNode | GInstrumentNode | AudioNode) {
		for (const [id, node] of this.audioNodes.entries()) {
			if (node === targetNode) return id;
		}

		return undefined;
	}

	private playAndSubscribeInstrument(node: GInstrumentNode) {
		const nodeId = this.getNodeId(node);

		if (!nodeId) return;

		this.unsubscribers.get(nodeId)?.();

		if (typeof node.subscribe === "function") {
			this.unsubscribers.set(
				nodeId,
				node.subscribe((payload: unknown) => {
					this.publishSubscriptionEvent(nodeId, payload);
				}),
			);
		}

		node.play();
	}

	private stopAndUnsubscribeInstrument(node: GInstrumentNode) {
		const nodeId = this.getNodeId(node);

		if (nodeId) {
			this.unsubscribers.get(nodeId)?.();
			this.unsubscribers.delete(nodeId);
		}

		node.stop();
	}

	private toggleInstrumentPlaybackAndSubscription(
		node: GInstrumentNode,
		isPlaying: boolean,
	) {
		if (isPlaying) this.playAndSubscribeInstrument(node);
		else this.stopAndUnsubscribeInstrument(node);
	}

	private disconnectAllNodes() {
		for (const node of this.audioNodes.values()) {
			// Safari crashes if node not connected
			try {
				node.disconnect();
			} catch {
				// pass through
			}
		}
	}

	private updateAudioNodes(
		nextNodes: AppState["audioNodes"]["byId"],
		isPlaying: AppState["globalPlayback"]["isPlaying"],
	) {
		if (!this.audioContext) return;

		for (const id of this.audioNodes.keys()) {
			if (!(id in nextNodes)) this.audioNodes.delete(id);
		}

		for (const [id, nodeState] of Object.entries(nextNodes)) {
			if (this.audioNodes.has(id)) continue;

			const newNode = createNewNode(this.audioContext, nodeState);

			if (!newNode) continue;

			this.audioNodes.set(id, newNode);

			if (isPlaying && isInstrumentNode(newNode)) {
				this.playAndSubscribeInstrument(newNode);
			}
		}

		this.audioNodes.set(MAIN_OUT_ID, this.audioContext.destination);
	}

	private updateAudioGraph(connections: AppState["connections"]) {
		this.disconnectAllNodes();

		for (const { from, to } of connections) {
			const fromNode = this.audioNodes.get(from);
			const toNode = this.audioNodes.get(to);

			if (fromNode && toNode) (fromNode as GAudioNode).connect(toNode);
		}
	}

	private updateNode({
		id,
		audioProps,
	}: {
		id: string;
		audioProps: Record<string, unknown>;
	}) {
		const node = this.audioNodes.get(id);

		if (!node) return;

		setNodeProps({ node, audioProps });
	}
}

const setNodeProps = ({
	node,
	audioProps,
}: {
	node: AudioEngineNode;
	audioProps: Record<string, unknown>;
}) => {
	if (!(node instanceof GAudioNode)) return;

	try {
		if (typeof node.set === "function") node.set(audioProps);
	} catch (reason) {
		logWarn(reason);
	}
};

function createNewNode(
	context: AudioContext,
	state: AudioNodeState<Record<string, unknown>>,
): GAudioNode | GInstrumentNode | undefined {
	switch (state.type) {
		case delayType:
			return createDelayNode(context, state.audioProps);
		case reverbType:
			return createReverbNode(context, state.audioProps) as GAudioNode;
		case loopType:
			return createLoopNode(context, state.audioProps);
		default:
			return;
	}
}

async function registerWorklets(context: AudioContext) {
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
}

type AudioEngineNode = AudioNode | GAudioNode | GInstrumentNode;

type InstrumentNodeProcessor = (node: GInstrumentNode) => void;

type SubscriptionEventDispatcher = (nodeId: string, payload: unknown) => void;
