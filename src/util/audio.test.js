import { hasDownstreamConnectionTo } from './audio'

describe('Audio util', () => {
  it('Should determine if from id is connected downstream to id', () => {
    const connections = [
      { from: 'a', to: 'b' },
      { from: 'a', to: 'd' },
      { from: 'd', to: 'a' },
      { from: 'e', to: 'f' },
      { from: 'e', to: 'g' },
      { from: 'b', to: 'c' },
    ]

    const connectedToC = hasDownstreamConnectionTo('c', connections)

    expect(connectedToC('a')).toBe(true)
    expect(connectedToC('d')).toBe(true)
    expect(connectedToC('e')).toBe(false)
  })

  it('Should check circular downstream connection', () => {
    const connections = [
      { from: 'a', to: 'b' },
      { from: 'a', to: 'd' },
      { from: 'd', to: 'a' },
      { from: 'b', to: 'c' },
    ]

    const connectedToC = hasDownstreamConnectionTo('c', connections)

    expect(connectedToC('d')).toBe(true)
  })
})
