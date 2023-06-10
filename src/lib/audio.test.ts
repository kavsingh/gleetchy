/* eslint-disable vitest/max-expects */
import { describe, it, expect } from "vitest";

import {
	hasAudioEffectType,
	hasInstrumentType,
	isSameConnection,
	getConnectionsFor,
	hasConnectionTo,
	canConnectNodes,
	getConnectionBetween,
} from "./audio";

describe("lib/audio", () => {
	describe("isAudioEffect", () => {
		it("determines if node is an audio effect", () => {
			expect(hasAudioEffectType({})).toBeFalsy();
			expect(hasAudioEffectType({ type: "not_effect" })).toBeFalsy();
			expect(hasAudioEffectType({ type: "audio_effect" })).toBeFalsy();
			expect(hasAudioEffectType({ type: "AUDIO_EFFECT" })).toBeFalsy();
			expect(hasAudioEffectType({ type: "audio_effect_" })).toBeTruthy();
			expect(hasAudioEffectType({ type: "AUDIO_EFFECT_" })).toBeTruthy();
			expect(hasAudioEffectType({ type: "audio-effect_" })).toBeFalsy();
			expect(hasAudioEffectType({ type: "AUDIO_EFFECT-" })).toBeFalsy();
		});
	});

	describe("isInstrument", () => {
		it("determines if node is an instrument", () => {
			expect(hasInstrumentType({})).toBeFalsy();
			expect(hasInstrumentType({ type: "not_instrument" })).toBeFalsy();
			expect(hasInstrumentType({ type: "instrument" })).toBeFalsy();
			expect(hasInstrumentType({ type: "INSTRUMENT" })).toBeFalsy();
			expect(hasInstrumentType({ type: "instrument_" })).toBeTruthy();
			expect(hasInstrumentType({ type: "INSTRUMENT_" })).toBeTruthy();
			expect(hasInstrumentType({ type: "instrument-" })).toBeFalsy();
			expect(hasInstrumentType({ type: "INSTRUMENT-" })).toBeFalsy();
		});
	});

	describe("isSameConnection", () => {
		it("determines if two connections are the same", () => {
			expect(
				isSameConnection({ from: "a", to: "b" }, { from: "a", to: "b" }),
			).toBeTruthy();
			expect(
				isSameConnection({ from: "a", to: "b" }, { to: "b", from: "a" }),
			).toBeTruthy();
			expect(
				isSameConnection({ from: "a", to: "b" }, { from: "b", to: "a" }),
			).toBeFalsy();
		});
	});

	describe("getConnectionsFor", () => {
		it("returns an array of direct connections for given node", () => {
			const connections = [
				{ from: "a", to: "b", color: "" },
				{ from: "a", to: "d", color: "" },
				{ from: "d", to: "a", color: "" },
				{ from: "e", to: "f", color: "" },
				{ from: "e", to: "g", color: "" },
				{ from: "b", to: "c", color: "" },
			];

			expect(getConnectionsFor("q", connections)).toStrictEqual([]);
			expect(getConnectionsFor("a", connections)).toStrictEqual([
				{ from: "a", to: "b", color: "" },
				{ from: "a", to: "d", color: "" },
				{ from: "d", to: "a", color: "" },
			]);
			expect(getConnectionsFor("g", connections)).toStrictEqual([
				{ from: "e", to: "g", color: "" },
			]);
		});
	});

	describe("hasConnectionTo", () => {
		it("should determine if from id is connected to id", () => {
			const connections = [
				{ from: "a", to: "b" },
				{ from: "a", to: "d" },
				{ from: "d", to: "a" },
				{ from: "e", to: "f" },
				{ from: "e", to: "g" },
				{ from: "b", to: "c" },
			];

			const connectedToC = hasConnectionTo.bind(null, connections, "c");

			expect(connectedToC("a")).toBeTruthy();
			expect(connectedToC("d")).toBeTruthy();
			expect(connectedToC("e")).toBeFalsy();
			expect(hasConnectionTo(connections, "f", "e")).toBeTruthy();
		});
	});

	describe("canConnectNodes", () => {
		it("returns true if nodes are unconnected", () => {
			expect(canConnectNodes([], { id: "a" }, { id: "b" })).toBeTruthy();
		});

		it("returns false if same node", () => {
			expect(canConnectNodes([], { id: "a" }, { id: "a" })).toBeFalsy();
		});

		it("returns false if to node is connected to from node", () => {
			const connections = [
				{ from: "d", to: "b" },
				{ from: "b", to: "a" },
			];

			const canConnectIn = canConnectNodes.bind(null, connections);

			expect(canConnectIn({ id: "a" }, { id: "d" })).toBeFalsy();
		});
	});

	describe("getConnectionBetween", () => {
		it("returns first found connection between nodes", () => {
			const connections = [
				{ from: "a", to: "b", color: "black" },
				{ from: "a", to: "b", color: "white" },
			];

			const getConnection = getConnectionBetween.bind(null, connections);

			expect(getConnection({ id: "a" }, { id: "b" })).toStrictEqual({
				from: "a",
				to: "b",
				color: "black",
			});
			expect(getConnection({ id: "b" }, { id: "a" })).toBeUndefined();
			expect(getConnection({ id: "q" }, { id: "r" })).toBeUndefined();
		});
	});
});
