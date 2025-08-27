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

	describe(isSameConnection, () => {
		it("should determine if two connections are the same", () => {
			expect.assertions(3);
			expect(
				isSameConnection(
					{ fromId: "a", toId: "b" },
					{ fromId: "a", toId: "b" },
				),
			).toBe(true);
			expect(
				isSameConnection(
					{ fromId: "a", toId: "b" },
					{ toId: "b", fromId: "a" },
				),
			).toBe(true);
			expect(
				isSameConnection(
					{ fromId: "a", toId: "b" },
					{ fromId: "b", toId: "a" },
				),
			).toBe(false);
		});
	});

	describe(getConnectionsFor, () => {
		const connections = [
			{ fromId: "a", toId: "b", color: "" },
			{ fromId: "a", toId: "d", color: "" },
			{ fromId: "d", toId: "a", color: "" },
			{ fromId: "e", toId: "f", color: "" },
			{ fromId: "e", toId: "g", color: "" },
			{ fromId: "b", toId: "c", color: "" },
		];

		it("should return an array of direct connections for given node", () => {
			expect.assertions(3);
			expect(getConnectionsFor("q", connections)).toStrictEqual([]);
			expect(getConnectionsFor("a", connections)).toStrictEqual([
				{ fromId: "a", toId: "b", color: "" },
				{ fromId: "a", toId: "d", color: "" },
				{ fromId: "d", toId: "a", color: "" },
			]);
			expect(getConnectionsFor("g", connections)).toStrictEqual([
				{ fromId: "e", toId: "g", color: "" },
			]);
		});
	});

	describe(hasConnectionTo, () => {
		const connections = [
			{ fromId: "a", toId: "b" },
			{ fromId: "a", toId: "d" },
			{ fromId: "d", toId: "a" },
			{ fromId: "e", toId: "f" },
			{ fromId: "e", toId: "g" },
			{ fromId: "b", toId: "c" },
		];

		it("should determine if from id is connected to id", () => {
			expect.assertions(4);

			const connectedToC = hasConnectionTo.bind(null, connections, "c");

			expect(connectedToC("a")).toBe(true);
			expect(connectedToC("d")).toBe(true);
			expect(connectedToC("e")).toBe(false);
			expect(hasConnectionTo(connections, "f", "e")).toBe(true);
		});
	});

	describe(canConnectNodes, () => {
		it("should return true if nodes are unconnected", () => {
			expect.assertions(1);
			expect(canConnectNodes([], { id: "a" }, { id: "b" })).toBe(true);
		});

		it("should return false if same node", () => {
			expect.assertions(1);
			expect(canConnectNodes([], { id: "a" }, { id: "a" })).toBe(false);
		});

		it("should return false if to node is connected to from node", () => {
			expect.assertions(1);

			const connections = [
				{ fromId: "d", toId: "b" },
				{ fromId: "b", toId: "a" },
			];

			const canConnectIn = canConnectNodes.bind(null, connections);

			expect(canConnectIn({ id: "a" }, { id: "d" })).toBe(false);
		});
	});

	describe(getConnectionBetween, () => {
		const connections = [
			{ fromId: "a", toId: "b", color: "black" },
			{ fromId: "a", toId: "b", color: "white" },
		];

		it("should return first found connection between nodes", () => {
			expect.assertions(3);

			const getConnection = getConnectionBetween.bind(null, connections);

			expect(getConnection({ id: "a" }, { id: "b" })).toStrictEqual({
				fromId: "a",
				toId: "b",
				color: "black",
			});
			expect(getConnection({ id: "b" }, { id: "a" })).toBeUndefined();
			expect(getConnection({ id: "q" }, { id: "r" })).toBeUndefined();
		});
	});
});
