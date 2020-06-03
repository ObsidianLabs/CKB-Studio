import { createStore, combineReducers, applyMiddleware } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import configureRedux from 'redux-config'

import * as config from './config'
import middlewares from './middlewares'
import updateStore from './updateStore'

export { Provider } from 'react-redux'
export { connect } from './connect'

const { actions, reducers, persists } = configureRedux(config)
console.info('[Redux] store to persist', persists)

export default actions
export const store = createStore(
  persistReducer(
    {
      key: 'root',
      storage,
      whitelist: persists,
      transforms: [immutableTransform()]
    },
    combineReducers(reducers)
  ),
  applyMiddleware(...middlewares)
)

export function reduxLoaded () {
  return new Promise(resolve => {
    const persistor = persistStore(store, null, () => {
      // update store due to app update
      updateStore({ persistor, store, actions })
      resolve(store.getState())
    })
    // persistor.purge();
  })
}

export function dispatch (action, params) {
  store.dispatch(actions[action](params))
}
