import { createStore } from "solid-js/store";

const [store, setStore] = createStore<GlobalTransportState>({
	isPlaying: false,
});

export { store as globalTransport };

export function togglePlayback() {
	setStore("isPlaying", (current) => !current);
}

interface GlobalTransportState {
	isPlaying: boolean;
}
