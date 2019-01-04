import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginScreen from "./src/screens/LoginScreen";
import UsersScreen from "./src/screens/UsersScreen";
import ChatScreen from "./src/screens/ChatScreen";

import { Provider } from "react-redux";
import { createStore } from "redux";

import reducers from "./src/reducers";

const store = createStore(reducers);

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

const AppContainer = createAppContainer(RootStack);

class Router extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default Router;