import { describe, it, expect, vi } from "vitest";

import { cancelEvent, cancelReactEvent } from "./event";

const createMockEvent = () => ({
	preventDefault: vi.fn(),
	stopPropagation: vi.fn(),
});

describe("util/event", () => {
	describe("cancelEvent", () => {
		it("cancels event default behaviours", () => {
			const mockEvent = createMockEvent();

			const result = cancelEvent(mockEvent as unknown as Event);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
			expect(result).toBe(false);
		});
	});

	describe("cancelReactEvent", () => {
		it("cancels react event default behaviours", () => {
			const mockEvent = createMockEvent();

			const result = cancelReactEvent({
				nativeEvent: mockEvent as unknown as Event,
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
			expect(result).toBe(false);
		});
	});
});
