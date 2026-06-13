// import thunk from 'redux-thunk';
// import rootReducer from '../reducers';
import { configureStore } from '@reduxjs/toolkit'

// const configureStores = () => {
//   return configureStore({ reducer: rootReducer, middleware: [thunk] });
// }

// export default configureStores;import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducers'

const configureStores = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(), // adds thunk automatically
  })
}

export default configureStores

