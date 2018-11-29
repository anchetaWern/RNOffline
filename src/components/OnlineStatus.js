import React, { Component } from "react";
import { View, Text, NetInfo } from "react-native";

class OnlineStatus extends Component {
  state = {
    isConnected: false
  };

  componentDidMount() {
    NetInfo.addEventListener("connectionChange", this.handleConnectionChange);
  }

  handleConnectionChange = connectionInfo => {
    console.log("connection infos: ", connectionInfo);
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log("remos");
      this.setState({ isConnected: isConnected });
    });
  };

  render() {
    const boxClass = this.state.isConnected ? "success" : "danger";
    const boxText = this.state.isConnected ? "online" : "offline";

    return (
      <View style={[styles.alertBox, styles[boxClass]]}>
        <Text style={styles.statusText}>you're {boxText}</Text>
      </View>
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectionChange
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

export default OnlineStatus;
