import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import gleetchy from './gleetchy/reducer'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export const configureStore = (initialState = {}) =>
  createStore(
    combineReducers({ gleetchy }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
