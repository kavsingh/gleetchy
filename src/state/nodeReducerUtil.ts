import { propEq, without } from 'ramda'

const idEquals = propEq('id')

export const removeNodeFromState = <T extends any[]>(
  state: T,
  { id }: { id: string },
) => {
  const existing = state.find(idEquals(id))

  return existing ? without([existing], state) : state
}

export const updateNodePropsInState = <T extends any[]>(
  state: T,
  { id, props }: { id: string; props: object },
) => {
  const existingIdx = state.findIndex(idEquals(id))

  if (existingIdx === -1) {
    return state
  }

  const newState = [...state]

  newState[existingIdx] = {
    ...newState[existingIdx],
    props: { ...newState[existingIdx].props, ...props },
  }

  return newState
}

export const updateNodeLabelInState = <T extends any[]>(
  state: T,
  { id, label }: { id: string; label: string },
) => {
  const existingIdx = state.findIndex(idEquals(id))

  if (existingIdx === -1) {
    return state
  }

  const newState = [...state]

  newState[existingIdx] = { ...newState[existingIdx], label }

  return newState
}
