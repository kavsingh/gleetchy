import { cancelEvent, cancelReactEvent } from './event'

const createMockEvent = (): any => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
})

describe('util/event', () => {
  describe('cancelEvent', () => {
    it('cancels event default behaviours', () => {
      const mockEvent = createMockEvent()

      const result = cancelEvent(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('cancelReactEvent', () => {
    it('cancels react event default behaviours', () => {
      const mockEvent = createMockEvent()

      const result = cancelReactEvent({ nativeEvent: mockEvent })

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })
})
