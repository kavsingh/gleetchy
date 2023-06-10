import { describe, it, expect } from "vitest";

import { globalPlaybackSlice } from "./slice";
import { togglePlayback } from "./actions";

describe("globalPlaybackSlice", () => {
	it("should toggle playback", () => {
		expect(
			globalPlaybackSlice.reducer({ isPlaying: false }, togglePlayback),
		).toStrictEqual({ isPlaying: true });

		expect(
			globalPlaybackSlice.reducer({ isPlaying: true }, togglePlayback),
		).toStrictEqual({ isPlaying: false });
	});
});
