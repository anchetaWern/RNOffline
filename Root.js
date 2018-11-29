import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";

import ImagesScreen from "./src/screens/ImagesScreen";
import OnlineStatusScreen from "./src/screens/OnlineStatusScreen";
import RehydrateScreen from "./src/screens/RehydrateScreen";

const RootStack = createStackNavigator(
  {
    Images: ImagesScreen,
    OnlineStatus: OnlineStatusScreen,
    Rehydrate: RehydrateScreen
  },
  {
    initialRouteName: "Rehydrate"
  }
);

const AppContainer = createAppContainer(RootStack);

class Router extends Component {
  render() {
    return <AppContainer />;
  }
}

export default Router;
