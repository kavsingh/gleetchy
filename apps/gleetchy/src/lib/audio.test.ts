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
		it.each([
			["", false],
			["not_effect", false],
			["audio_effect", false],
			["AUDIO_EFFECT", false],
			["audio-effect-", false],
			["AUDIO_EFFECT-", false],
			["audio_effect_", true],
			["AUDIO_EFFECT_", true],
		])("should determine type %s is %s for audio effect", (type, expected) => {
			expect.assertions(1);
			expect(hasAudioEffectType({ type })).toBe(expected);
		});
	});

	describe("isInstrument", () => {
		it.each([
			["", false],
			["not_instrument", false],
			["instrument", false],
			["INSTRUMENT", false],
			["instrument-", false],
			["INSTRUMENT-", false],
			["instrument_", true],
			["INSTRUMENT_", true],
		])("should determine type %s is %s for instrument", (type, expected) => {
			expect.assertions(1);
			expect(hasInstrumentType({ type })).toBe(expected);
		});
	});

	describe("isSameConnection", () => {
		it("should determine if two connections are the same", () => {
			expect.assertions(3);
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
		const connections = [
			{ from: "a", to: "b", color: "" },
			{ from: "a", to: "d", color: "" },
			{ from: "d", to: "a", color: "" },
			{ from: "e", to: "f", color: "" },
			{ from: "e", to: "g", color: "" },
			{ from: "b", to: "c", color: "" },
		];

		it("should return an array of direct connections for given node", () => {
			expect.assertions(3);
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
		const connections = [
			{ from: "a", to: "b" },
			{ from: "a", to: "d" },
			{ from: "d", to: "a" },
			{ from: "e", to: "f" },
			{ from: "e", to: "g" },
			{ from: "b", to: "c" },
		];

		it("should determine if from id is connected to id", () => {
			expect.assertions(4);

			const connectedToC = hasConnectionTo.bind(null, connections, "c");

			expect(connectedToC("a")).toBeTruthy();
			expect(connectedToC("d")).toBeTruthy();
			expect(connectedToC("e")).toBeFalsy();
			expect(hasConnectionTo(connections, "f", "e")).toBeTruthy();
		});
	});

	describe("canConnectNodes", () => {
		it("should return true if nodes are unconnected", () => {
			expect.assertions(1);
			expect(canConnectNodes([], { id: "a" }, { id: "b" })).toBeTruthy();
		});

		it("should return false if same node", () => {
			expect.assertions(1);
			expect(canConnectNodes([], { id: "a" }, { id: "a" })).toBeFalsy();
		});

		it("should return false if to node is connected to from node", () => {
			expect.assertions(1);

			const connections = [
				{ from: "d", to: "b" },
				{ from: "b", to: "a" },
			];

			const canConnectIn = canConnectNodes.bind(null, connections);

			expect(canConnectIn({ id: "a" }, { id: "d" })).toBeFalsy();
		});
	});

	describe("getConnectionBetween", () => {
		const connections = [
			{ from: "a", to: "b", color: "black" },
			{ from: "a", to: "b", color: "white" },
		];

		it("should return first found connection between nodes", () => {
			expect.assertions(3);

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
