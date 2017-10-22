import { without, propEq } from 'ramda'

const idEquals = propEq('id')

export const removeNodeFromState = (state, { id }) => {
  const existing = state.find(idEquals(id))

  return existing ? without([existing], state) : state
}

export const updateNodePropsInState = (state, { id, props }) => {
  const existingIdx = state.findIndex(idEquals(id))

  if (existingIdx === -1) return state

  const newState = [...state]

  newState[existingIdx] = {
    ...newState[existingIdx],
    props: { ...newState[existingIdx].props, ...props },
  }

  return newState
}

export const updateNodeLabelInState = (state, { id, label }) => {
  const existingIdx = state.findIndex(idEquals(id))

  if (existingIdx === -1) return state

  const newState = [...state]

  newState[existingIdx] = { ...newState[existingIdx], label }

  return newState
}
