import React, { Component } from "react";
import { View, Text } from "react-native";
import { withNetworkConnectivity } from "react-native-offline";

class OnlineStatusLib extends Component {
  render() {
    const { isConnected } = this.props;
    const boxClass = isConnected ? "success" : "danger";
    const boxText = isConnected ? "online" : "offline";

    return (
      <View style={[styles.alertBox, styles[boxClass]]}>
        <Text style={styles.statusText}>you're {boxText}</Text>
      </View>
    );
  }
}

const styles = {
  alertBox: {
    padding: 10,
    marginTop: 10
  },
  success: {
    backgroundColor: "#95da1b"
  },
  danger: {
    backgroundColor: "#f96161"
  },
  statusText: {
    fontSize: 17
  }
};

export default withNetworkConnectivity()(OnlineStatusLib);
