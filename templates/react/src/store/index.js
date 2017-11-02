import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

import rootReducer from '../reducers';

export default function configureStore(initialState = {}) {
  const middlewares = [
    thunkMiddleware,
    promiseMiddleware,
    thunkMiddleware,
  ];
  const enhancers = [];

  if (__DEVELOPMENT__) {
    const { createLogger } = require('redux-logger'); // eslint-disable-line
    const loggerMiddleware = createLogger({
      level: 'info',
      collapsed: true,
    });
    middlewares.push(loggerMiddleware);
    const { devToolsExtension } = window;
    if (devToolsExtension) {
      enhancers.push(devToolsExtension());
    }
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers,
    ),
  );

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }
  return store;
}
