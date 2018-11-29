import React, { Component } from "react";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

import { reducer } from "../redux";
import { watcherSaga } from "../sagas";

import PokemonLoader from "../components/PokemonLoader";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
let persistor = persistStore(store);

sagaMiddleware.run(watcherSaga);

export default class RehydrateScreen extends Component {
  static navigationOptions = {
    title: "Rehydrate"
  };

  render() {
    return (
      <Provider store={store}>
        <PokemonLoader />
      </Provider>
    );
  }
}
