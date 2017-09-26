import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import gleetchy from './gleetchy/reducer'

const middlewares = []
const composeEnhancers = composeWithDevTools({})

export default function configureStore(initialState = {}) {
  return createStore(
    combineReducers({ gleetchy }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
}
