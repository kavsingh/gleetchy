import {
  isAudioEffect,
  isInstrument,
  isSameConnection,
  getConnectionsFor,
  hasDownstreamConnectionTo,
  canConnectNodes,
  // getConnectionBetween,
} from './audio'

describe('Audio util', () => {
  describe('isAudioEffect', () => {
    it('determines if node is an audio effect', () => {
      expect(isAudioEffect({})).toBe(false)
      expect(isAudioEffect({ type: 'not_effect' })).toBe(false)
      expect(isAudioEffect({ type: 'audio_effect' })).toBe(false)
      expect(isAudioEffect({ type: 'AUDIO_EFFECT' })).toBe(false)
      expect(isAudioEffect({ type: 'audio_effect_' })).toBe(true)
      expect(isAudioEffect({ type: 'AUDIO_EFFECT_' })).toBe(true)
      expect(isAudioEffect({ type: 'audio-effect_' })).toBe(false)
      expect(isAudioEffect({ type: 'AUDIO_EFFECT-' })).toBe(false)
    })
  })

  describe('isInstrument', () => {
    it('determines if node is an instrument', () => {
      expect(isInstrument({})).toBe(false)
      expect(isInstrument({ type: 'not_instrument' })).toBe(false)
      expect(isInstrument({ type: 'instrument' })).toBe(false)
      expect(isInstrument({ type: 'INSTRUMENT' })).toBe(false)
      expect(isInstrument({ type: 'instrument_' })).toBe(true)
      expect(isInstrument({ type: 'INSTRUMENT_' })).toBe(true)
      expect(isInstrument({ type: 'instrument-' })).toBe(false)
      expect(isInstrument({ type: 'INSTRUMENT-' })).toBe(false)
    })
  })

  describe('isSameConnection', () => {
    it('determines if two connections are the same', () => {
      expect(
        isSameConnection({ from: 'a', to: 'b' }, { from: 'a', to: 'b' }),
      ).toBe(true)
      expect(
        isSameConnection({ from: 'a', to: 'b' })({ to: 'b', from: 'a' }),
      ).toBe(true)
      expect(
        isSameConnection({ from: 'a', to: 'b' })({ from: 'b', to: 'a' }),
      ).toBe(false)
    })
  })

  describe('getConnectionsFor', () => {
    it('returns an array of direct connections for given node', () => {
      const connections = [
        { from: 'a', to: 'b', color: '' },
        { from: 'a', to: 'd', color: '' },
        { from: 'd', to: 'a', color: '' },
        { from: 'e', to: 'f', color: '' },
        { from: 'e', to: 'g', color: '' },
        { from: 'b', to: 'c', color: '' },
      ]

      expect(getConnectionsFor('q', connections)).toEqual([])
      expect(getConnectionsFor('a')(connections)).toEqual([
        { from: 'a', to: 'b', color: '' },
        { from: 'a', to: 'd', color: '' },
        { from: 'd', to: 'a', color: '' },
      ])
      expect(getConnectionsFor('g')(connections)).toEqual([
        { from: 'e', to: 'g', color: '' },
      ])
    })
  })

  describe('hasDownstreamConnectionTo', () => {
    it('Should determine if from id is connected downstream to id', () => {
      const connections = [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'd' },
        { from: 'd', to: 'a' },
        { from: 'e', to: 'f' },
        { from: 'e', to: 'g' },
        { from: 'b', to: 'c' },
      ]

      const connectedToC = hasDownstreamConnectionTo(connections, 'c')

      expect(connectedToC('a')).toBe(true)
      expect(connectedToC('d')).toBe(true)
      expect(connectedToC('e')).toBe(false)
      expect(hasDownstreamConnectionTo(connections, 'f', 'e')).toBe(true)
    })

    it('Should check circular downstream connection', () => {
      const connections = [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'd' },
        { from: 'd', to: 'a' },
        { from: 'b', to: 'c' },
      ]

      expect(hasDownstreamConnectionTo(connections)('c', 'd')).toBe(true)
    })
  })

  describe('canConnectNodes', () => {
    it('returns true if nodes are unconnected', () => {
      expect(canConnectNodes([], { id: 'a' }, { id: 'b' })).toBe(true)
    })

    it('returns false if same node', () => {
      expect(canConnectNodes([], { id: 'a' }, { id: 'a' })).toBe(false)
    })

    it('returns false if nodes are connected', () => {
      const connections = [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'd' },
        { from: 'd', to: 'a' },
        { from: 'b', to: 'c' },
      ]

      const canConnectIn = canConnectNodes(connections)

      expect(canConnectIn({ id: 'a' }, { id: 'd' })).toBe(false)
      expect(canConnectIn({ id: 'a' }, { id: 'c' })).toBe(false)
    })
  })
})
