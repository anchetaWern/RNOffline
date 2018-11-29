import React, { Component } from "react";
import { ScrollView } from "react-native";
import OnlineStatus from "../components/OnlineStatus"; // using NetInfo
import OnlineStatusLib from "../components/OnlineStatusLib"; // using React Native Offline library

export default class OnlineStatusScreen extends Component {
  static navigationOptions = {
    title: "Online Status"
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <OnlineStatusLib />
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
};
