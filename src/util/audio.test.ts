import { hasDownstreamConnectionTo } from './audio'

describe('Audio util', () => {
  it('Should determine if from id is connected downstream to id', () => {
    const connections = [
      { from: 'a', to: 'b', color: '#fff' },
      { from: 'a', to: 'd', color: '#fff' },
      { from: 'd', to: 'a', color: '#fff' },
      { from: 'e', to: 'f', color: '#fff' },
      { from: 'e', to: 'g', color: '#fff' },
      { from: 'b', to: 'c', color: '#fff' },
    ]

    const connectedToC = hasDownstreamConnectionTo('c', connections)

    expect(connectedToC('a')).toBe(true)
    expect(connectedToC('d')).toBe(true)
    expect(connectedToC('e')).toBe(false)
  })

  it('Should check circular downstream connection', () => {
    const connections = [
      { from: 'a', to: 'b', color: '#fff' },
      { from: 'a', to: 'd', color: '#fff' },
      { from: 'd', to: 'a', color: '#fff' },
      { from: 'b', to: 'c', color: '#fff' },
    ]

    const connectedToC = hasDownstreamConnectionTo('c', connections)

    expect(connectedToC('d')).toBe(true)
  })
})
