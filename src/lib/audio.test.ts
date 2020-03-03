import {
  hasAudioEffectType,
  hasInstrumentType,
  isSameConnection,
  getConnectionsFor,
  hasConnectionTo,
  canConnectNodes,
  getConnectionBetween,
} from './audio'

describe('lib/audio', () => {
  describe('isAudioEffect', () => {
    it('determines if node is an audio effect', () => {
      expect(hasAudioEffectType({})).toBe(false)
      expect(hasAudioEffectType({ type: 'not_effect' })).toBe(false)
      expect(hasAudioEffectType({ type: 'audio_effect' })).toBe(false)
      expect(hasAudioEffectType({ type: 'AUDIO_EFFECT' })).toBe(false)
      expect(hasAudioEffectType({ type: 'audio_effect_' })).toBe(true)
      expect(hasAudioEffectType({ type: 'AUDIO_EFFECT_' })).toBe(true)
      expect(hasAudioEffectType({ type: 'audio-effect_' })).toBe(false)
      expect(hasAudioEffectType({ type: 'AUDIO_EFFECT-' })).toBe(false)
    })
  })

  describe('isInstrument', () => {
    it('determines if node is an instrument', () => {
      expect(hasInstrumentType({})).toBe(false)
      expect(hasInstrumentType({ type: 'not_instrument' })).toBe(false)
      expect(hasInstrumentType({ type: 'instrument' })).toBe(false)
      expect(hasInstrumentType({ type: 'INSTRUMENT' })).toBe(false)
      expect(hasInstrumentType({ type: 'instrument_' })).toBe(true)
      expect(hasInstrumentType({ type: 'INSTRUMENT_' })).toBe(true)
      expect(hasInstrumentType({ type: 'instrument-' })).toBe(false)
      expect(hasInstrumentType({ type: 'INSTRUMENT-' })).toBe(false)
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

  describe('hasConnectionTo', () => {
    it('Should determine if from id is connected to id', () => {
      const connections = [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'd' },
        { from: 'd', to: 'a' },
        { from: 'e', to: 'f' },
        { from: 'e', to: 'g' },
        { from: 'b', to: 'c' },
      ]

      const connectedToC = hasConnectionTo(connections, 'c')

      expect(connectedToC('a')).toBe(true)
      expect(connectedToC('d')).toBe(true)
      expect(connectedToC('e')).toBe(false)
      expect(hasConnectionTo(connections, 'f', 'e')).toBe(true)
    })
  })

  describe('canConnectNodes', () => {
    it('returns true if nodes are unconnected', () => {
      expect(canConnectNodes([], { id: 'a' }, { id: 'b' })).toBe(true)
    })

    it('returns false if same node', () => {
      expect(canConnectNodes([], { id: 'a' }, { id: 'a' })).toBe(false)
    })

    it('returns false if to node is connected to from node', () => {
      const connections = [
        { from: 'd', to: 'b' },
        { from: 'b', to: 'a' },
      ]

      const canConnectIn = canConnectNodes(connections)

      expect(canConnectIn({ id: 'a' }, { id: 'd' })).toBe(false)
    })
  })

  describe('getConnectionBetween', () => {
    it('returns first found connection between nodes', () => {
      const connections = [
        { from: 'a', to: 'b', color: 'black' },
        { from: 'a', to: 'b', color: 'white' },
      ]

      const getConnection = getConnectionBetween(connections)

      expect(getConnection({ id: 'a' }, { id: 'b' })).toEqual({
        from: 'a',
        to: 'b',
        color: 'black',
      })
      expect(getConnection({ id: 'b' }, { id: 'a' })).toBeUndefined()
      expect(getConnection({ id: 'q' }, { id: 'r' })).toBeUndefined()
    })
  })
})
