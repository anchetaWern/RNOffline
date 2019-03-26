import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";

import randomstring from "random-string";
import { GiftedChat, Send } from "react-native-gifted-chat";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";

import {
  setCurrentRoom,
  setMessages,
  putMessage,
  putOlderMessages
} from "../actions";

import loginUser from '../helpers/loginUser';
import NetworkStatusBanner from "../components/NetworkStatusBanner";

const CHAT_SERVER = "https://YOUR_NGROK_URL/rooms";

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      headerTitle: `${params.chatWithUser}`
    };
  };

  state = {
    is_initialized: false,
    is_loading: false,
    show_load_earlier: false,
    is_picking_file: false
  };

  constructor(props) {
    super(props);
    this.unsent_messages = [];
  }


  async componentDidMount() {
    this.initializeChatRoom(false);
  }


  async componentDidUpdate (prevProps, prevState) {
    const { isConnected, user, navigation } = this.props;
    const currentUser = navigation.getParam('currentUser');

    if (isConnected && prevProps.isConnected != isConnected) {
      this.currentUser = await loginUser(currentUser.id);
      this.initializeChatRoom(true);
    } else if (!isConnected  && prevProps.isConnected != isConnected) {
      this.currentUser = user;
    }
  }


  initializeChatRoom = async (came_back_online) => {

    const { isConnected, room, messages, setMessages, navigation } = this.props;

    if (!came_back_online) {
      this.currentUser = navigation.getParam("currentUser");
    }

    this.roomName = navigation.getParam("roomName");

    if (isConnected) { // retains the old messages if user is offline
      this.unsent_messages = messages.filter((msg) => {
        return msg.not_sent;
      });
      setMessages([]);
    }

    try {
      let response = await fetch(CHAT_SERVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: this.currentUser.id,
          room_name: this.roomName
        })
      });

      if (response.ok) {
        let room = await response.json();

        let room_id = parseInt(room.id);
        await this.subscribeToRoom(room_id);

        await this.setState({
          is_initialized: true
        });
      }
    } catch (err) {
      console.log("error with chat server: ", err);
    }
  }


  onReceive = async data => {

    const { messages, putMessage } = this.props;
    let { message } = await this.getMessage(data);

    putMessage(message);
    if (messages && messages.length > 9) {
      this.setState({
        show_load_earlier: true
      });
    }
  };


  async onSend([message]) {
    this.sendMessage(message);
  }


  sendMessage = async (message) => {

    const { room, isConnected, putMessage } = this.props;

    let msg = {
      text: message.text,
      createdAt: message.createdAt, // note: this doesn't work. createdAt seems to be generated in Chatkit's database
      roomId: room.id
    };

    this.setState({
      is_sending: true
    });

    if (this.attachment) {
      msg.attachment = this.getAttachment();
    }

    if (message.attachment) {
      msg.attachment = message.attachment;
    }

    try {
      await this.currentUser.sendMessage(msg);

      this.attachment = null;
      this.setState({
        is_sending: false
      });
    } catch (e) {
      console.log("error sending message: ", e);
    }

    if (!isConnected) {

      message.not_sent = true;
      if (this.attachment) {
        message.attachment = this.getAttachment();
        message.image = this.attachment.uri;
      }

      putMessage(message);
      this.attachment = null;

      this.setState({
        is_sending: false
      });
    }
  }


  getAttachment = () => {
    const attachment = this.attachment;

    let filename = attachment.name
        ? attachment.name
        : randomstring() + ".jpg";
    let type = attachment.file_type
      ? attachment.file_type
      : "image/jpeg";

    return {
      file: {
        uri: attachment.uri,
        type: type,
        name: `${filename}`
      },
      name: `${filename}`,
      type: attachment.type
    };
  }


  render() {
    const { isConnected, isNetworkBannerVisible, room, navigation, messages } = this.props;
    const roomName = navigation.getParam("roomName");

    return (
      <View style={styles.container}>
        <NetworkStatusBanner
          isConnected={isConnected}
          isVisible={isNetworkBannerVisible}
        />

        {(this.state.is_loading || !this.state.is_initialized) && (
          <ActivityIndicator
            size="small"
            color="#0064e1"
            style={styles.loader}
          />
        )}

        {this.state.is_initialized && roomName == room.name && (
          <GiftedChat
            messages={messages}
            onSend={msg => this.onSend(msg)}
            user={{
              _id: this.currentUser.id
            }}
            renderActions={this.renderCustomActions}
            loadEarlier={this.state.show_load_earlier}
            onLoadEarlier={this.loadEarlierMessages}
            renderSend={this.renderSend}
          />
        )}
      </View>
    );
  }

  //

  renderSend = props => {
    if (this.state.is_sending) {
      return (
        <ActivityIndicator
          size="small"
          color="#0064e1"
          style={[styles.loader, styles.sendLoader]}
        />
      );
    }

    return <Send {...props} />;
  };

  //

  getMessage = async ({ id, senderId, text, attachment, createdAt }) => {
    let file_data = null;
    let msg_data = {
      _id: id.toString(),
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: senderId,
        avatar: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
      }
    };

    if (attachment) {
      const { link, type } = attachment;
      if (type == "image") {
        msg_data.image = link;
      }
    }

    return {
      message: msg_data
    };
  };


  loadEarlierMessages = async () => {
    this.setState({
      is_loading: true
    });

    const { room, messages, putOlderMessages } = this.props;
    const earliest_message_id = Math.min(...messages.map(m => parseInt(m._id)));

    try {
      const old_messages = await this.currentUser.fetchMessages({
        roomId: room.id,
        initialId: earliest_message_id,
        direction: "older",
        limit: 10
      });

      if (!old_messages.length) {
        this.setState({
          show_load_earlier: false
        });
      }

      let earlier_messages = [];
      for (msg of old_messages) {
        let { message } = await this.getMessage(msg);
        earlier_messages.push(message);
      }

      putOlderMessages(earlier_messages);
    } catch (e) {
      console.log("error loading older messages: ", e);
    }

    await this.setState({
      is_loading: false
    });
  };


  renderCustomActions = () => {
    if (!this.state.is_picking_file) {
      let icon_color = this.attachment ? "#0064e1" : "#808080";

      return (
        <View style={styles.customActionsContainer}>
          <TouchableOpacity onPress={this.openImagePicker}>
            <View style={styles.buttonContainer}>
              <Ionicons name="md-image" size={23} color={icon_color} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ActivityIndicator size="small" color="#0064e1" style={styles.loader} />
    );
  };

  //

  openImagePicker = () => {
    this.setState({
      is_picking_file: true
    });

    ImagePicker.showImagePicker({}, response => {
      if (!response.error && response.uri) {
        this.attachment = {
          uri: response.uri,
          type: response.type
        };

        Alert.alert("Success", "Photo attached!");

        this.setState({
          is_picking_file: false
        });
      }
    });
  };

  //

  subscribeToRoom = async roomId => {
    const { setCurrentRoom, navigation } = this.props;
    const roomName = navigation.getParam("roomName");

    try {
      setCurrentRoom({
        id: roomId,
        name: roomName
      });

      await this.currentUser.subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.onReceive(message);
          }
        },
        messageLimit: 11
      });

      this.unsent_messages.reverse();

      for(msg of this.unsent_messages){
        await this.sendMessage(msg);
      }

      this.unsent_messages = [];

    } catch (e) {
      console.log("error while subscribing to room: ", e);
    }
  };
}

const mapStateToProps = ({ chat, network }) => {
  const { isNetworkBannerVisible, user, room, messages } = chat;
  const { isConnected } = network;
  return {
    isConnected,
    isNetworkBannerVisible,
    user,
    room,
    messages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentRoom: room => {
      dispatch(setCurrentRoom(room));
    },
    setMessages: messages => {
      dispatch(setMessages(messages));
    },
    putMessage: message => {
      dispatch(putMessage(message));
    },
    putOlderMessages: older_messages => {
      dispatch(putOlderMessages(older_messages));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreen);

const styles = {
  container: {
    flex: 1
  },
  buttonContainer: {
    padding: 10
  },
  customActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  loader: {
    paddingTop: 20
  },
  sendLoader: {
    marginRight: 10,
    marginBottom: 10
  }
};