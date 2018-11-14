import produce from 'immer'
import { AudioNodeIdentifier, AudioNodeState } from '~/types'

export interface NodesReducerState<T extends AudioNodeState> {
  orderedIdentifiers: AudioNodeIdentifier[]
  byId: { [key: string]: T }
}

interface NodeById<T = AudioNodeState> {
  [key: string]: T
}

export const constructDefaultState = <T extends AudioNodeState>(
  initialNodes: T[],
) => ({
  byId: initialNodes.reduce((acc: NodeById<T>, instrument) => {
    acc[instrument.id] = instrument
    return acc
  }, {}),
  orderedIdentifiers: initialNodes.map(({ id, type }) => ({ id, type })),
})

export const removeNodeFromState = <
  N extends AudioNodeState,
  T extends NodesReducerState<N>
>(
  state: T,
  { id }: { id: string },
) =>
  produce<T>(state, draftState => {
    const orderedIndex = draftState.orderedIdentifiers.findIndex(
      node => id === node.id,
    )

    if (orderedIndex !== -1) {
      draftState.orderedIdentifiers.splice(orderedIndex, 1)
    }

    if (draftState.byId[id]) {
      delete draftState.byId[id]
    }
  })

export const updateNodePropsInState = <
  N extends AudioNodeState,
  T extends NodesReducerState<N>
>(
  state: T,
  { id, props }: { id: string; props: object },
) =>
  produce<T>(state, draftState => {
    const existing = draftState.byId[id]

    if (!existing) {
      return
    }

    Object.assign(existing.props, props)
  })

export const updateNodeLabelInState = <
  N extends AudioNodeState,
  T extends NodesReducerState<N>
>(
  state: T,
  { id, label }: { id: string; label: string },
) =>
  produce<T>(state, draftState => {
    const existing = draftState.byId[id]

    if (existing) {
      existing.label = label
    }
  })
