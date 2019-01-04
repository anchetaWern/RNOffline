import React from "react";
import { View, Text } from "react-native";

const NetworkStatusBanner = ({ isConnected, isVisible }) => {
  if (!isVisible) return null;

  const boxClass = isConnected ? "success" : "danger";
  const boxText = isConnected ? "online" : "offline";
  return (
    <View style={[styles.alertBox, styles[boxClass]]}>
      <Text style={styles.statusText}>you're {boxText}</Text>
    </View>
  );
};

//

const styles = {
  alertBox: {
    padding: 5
  },
  success: {
    backgroundColor: "#88c717"
  },
  danger: {
    backgroundColor: "#f96161"
  },
  statusText: {
    fontSize: 14,
    color: "#fff",
    alignSelf: "center"
  }
};

export default NetworkStatusBanner;
