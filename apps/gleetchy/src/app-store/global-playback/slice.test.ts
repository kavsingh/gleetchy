import { describe, it, expect } from "vitest";

import { togglePlayback } from "./actions";
import { globalPlaybackSlice } from "./slice";

describe("globalPlaybackSlice", () => {
	it("should toggle playback", () => {
		expect.assertions(2);

		expect(
			globalPlaybackSlice.reducer({ isPlaying: false }, togglePlayback()),
		).toStrictEqual({ isPlaying: true });

		expect(
			globalPlaybackSlice.reducer({ isPlaying: true }, togglePlayback()),
		).toStrictEqual({ isPlaying: false });
	});
});
