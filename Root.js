import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

import createSagaMiddleware from "redux-saga";

import {
  withNetworkConnectivity,
  reducer as network,
  createNetworkMiddleware
} from "react-native-offline";

import LoginScreen from "./src/screens/LoginScreen";
import UsersScreen from "./src/screens/UsersScreen";
import ChatScreen from "./src/screens/ChatScreen";

import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";

import ChatReducer from "./src/reducers/ChatReducer";

import { watcherSaga } from "./src/sagas";

const sagaMiddleware = createSagaMiddleware();
const networkMiddleware = createNetworkMiddleware();

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["network", "chat"]
};

const chatPersistConfig = {
  key: "chat",
  storage: storage,
  blacklist: ["isNetworkBannerVisible"]
};

const rootReducer = combineReducers({
  chat: persistReducer(chatPersistConfig, ChatReducer),
  network
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  persistedReducer,
  applyMiddleware(networkMiddleware, sagaMiddleware)
);
let persistor = persistStore(store);

sagaMiddleware.run(watcherSaga);

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Users: UsersScreen,
    Chat: ChatScreen
  },
  {
    initialRouteName: "Login"
  }
);

const App = withNetworkConnectivity({
  withRedux: true
})(RootStack);

const AppContainer = createAppContainer(App);

class Router extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

export default Router;