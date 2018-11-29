import React, { Component } from "react";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { reducer } from "../redux";
import { watcherSaga } from "../sagas";

import PokemonLoader from "../components/PokemonLoader";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

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
