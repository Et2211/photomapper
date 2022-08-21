
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import reduximmutablestateinvariant from 'redux-immutable-state-invariant'

export default function configureStore(initaialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    initaialState,
    composeEnhancers(applyMiddleware(reduximmutablestateinvariant()))
  )
  return store
}