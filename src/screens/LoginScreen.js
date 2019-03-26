import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

const CHAT_SERVER = "YOUR_NGROK_HTTPS_URL/users";

import loginUser from '../helpers/loginUser';

class LoginScreen extends Component {
  static navigationOptions = {
    title: "Login"
  };

  state = {
    username: "",
    enteredChat: false
  };

  constructor(props) {
    super(props);
    this.currentUser = null;
    this.chatManager = null;
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.fieldContainer}>
              <View>
                <Text style={styles.label}>Enter your username</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={username => this.setState({ username })}
                  value={this.state.username}
                />
              </View>

              {!this.state.enteredChat && (
                <TouchableOpacity onPress={this.enterChat}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                  </View>
                </TouchableOpacity>
              )}

              {this.state.enteredChat && (
                <Text style={styles.loadingText}>Loading...</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  //

  enterChat = async () => {
    const { username } = this.state;

    let chatserver_response = { ok: false };

    this.setState({
      enteredChat: true
    });

    try {
      chatserver_response = await fetch(CHAT_SERVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: username,
          username: username
        })
      });
    } catch (e) {
      console.log("error connecting to chat server: ", e);
    }

    if (chatserver_response.ok) {

      try {
        this.currentUser = await loginUser(username);

        this.setState({
          username: "",
          enteredChat: false
        });

        this.props.navigation.navigate("Users", {
          currentUser: this.currentUser
        });
      } catch(e) {
        console.log("err while logging in: ", e);
      }

    }

  };
}

export default LoginScreen;

const styles = {
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF"
  },
  fieldContainer: {
    marginTop: 20
  },
  label: {
    fontSize: 16
  },
  textInput: {
    height: 40,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#eaeaea",
    padding: 5
  },
  button: {
    alignSelf: "center",
    marginTop: 10
  },
  buttonText: {
    fontSize: 18,
    color: "#05a5d1"
  },
  loadingText: {
    alignSelf: "center"
  }
};