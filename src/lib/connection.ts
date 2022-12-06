import type {
	GAudioNodeConnectors,
	GAudioNodeConnectApi,
	AudioNodeReturn,
	GAudioNode,
	GInstrumentNode,
	GAudioNodeApi,
	GInstrumentNodeApi,
} from "~/types";

const createConnect = (getOutNode: AudioNodeReturn) =>
	function connect(node: AudioNode | GAudioNodeConnectApi) {
		const outNode = getOutNode();

		if (node instanceof AudioNode) {
			outNode.connect(node);
		} else if (typeof node.getInNode === "function") {
			outNode.connect(node.getInNode());
		} else {
			throw new Error("Unable to connect to node");
		}
	};

const createDisconnect = (getOutNode: AudioNodeReturn) =>
	function disconnect(node?: AudioNode | GAudioNodeConnectApi) {
		const outNode = getOutNode();

		if (!node) {
			outNode.disconnect();
		} else if (node instanceof AudioNode) {
			outNode.disconnect(node);
		} else if (typeof node.getInNode === "function") {
			outNode.disconnect(node.getInNode());
		} else {
			throw new Error("Unable to disconnect node");
		}
	};

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
export const makeConnectable =
	<N extends GAudioNode | GInstrumentNode>({
		getInNode,
		getOutNode,
	}: GAudioNodeConnectors) =>
	(
		api: N extends GInstrumentNode
			? GInstrumentNodeApi<any, any, any>
			: GAudioNodeApi<any, any>,
	): N =>
		Object.assign(api as any, {
			connect: createConnect(getOutNode),
			disconnect: createDisconnect(getOutNode),
			getInNode,
			getOutNode,
		});
/* eslint-enable */
