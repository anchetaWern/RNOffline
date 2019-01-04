import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import { connect } from "react-redux";

const presenceRoomId = "YOUR PRESENCE ROOM ID";

import { setUsers } from "../actions";

import sortUsers from '../helpers/sortUsers';
import loginUser from '../helpers/loginUser';

class UsersScreen extends Component {
  static navigationOptions = {
    headerTitle: "Users"
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.currentUser = navigation.getParam("currentUser");
  }

  async componentDidMount() {
    this.subscribeToPresenceRoom();
  }


  subscribeToPresenceRoom = async () => {

    const { setUsers } = this.props;

    try {
      let room = await this.currentUser.subscribeToRoom({
        roomId: parseInt(presenceRoomId),
        hooks: {
          onUserCameOnline: this.handleInUser,
          onUserJoinedRoom: this.handleInUser,
          onUserLeftRoom: this.handleOutUser,
          onUserWentOffline: this.handleOutUser
        }
      });

      let new_users = [];
      room.users.forEach(user => {
        if (user.id != this.currentUser.id) {
          let is_online = user.presence.state == "online" ? true : false;

          new_users.push({
            id: user.id,
            name: user.name,
            is_online
          });
        }
      });

      setUsers(sortUsers(new_users));
    } catch (e) {
      console.log("error subscribe to room: ", e);
    }

  }


  async componentWillUnmount() {
    try {
      await this.currentUser.disconnect();
    } catch (e) {
      console.log("error leaving presence room: ", e);
    }
  }


  render() {
    return (
      <View style={styles.container}>
        { this.renderUsers() }
      </View>
    );

  }


  renderUsers = () => {
    const { users } = this.props;

    if (!users) return null;
    if (users) {
      return (
        <View style={styles.body}>
          {users.length == 0 && (
            <View style={styles.activity}>
              <ActivityIndicator size="large" color="#05a5d1" />
              <Text style={styles.activityText}>Loading users...</Text>
            </View>
          )}

          {users.length > 0 && (
            <FlatList
              data={users}
              renderItem={this.renderItem}
              keyExtractor={item => {
                return item.id.toString();
              }}
            />
          )}
        </View>
      );
    }
  }

  //

  renderItem = ({ item }) => {
    let online_style = item.is_online ? "online" : "offline";

    return (
      <TouchableHighlight
        onPress={() => {
          this.beginChat(item);
        }}
        underlayColor="#f3f3f3"
        style={styles.listItem}
      >
        <View style={styles.listItemBody}>
          <View style={[styles.onlineIndicator, styles[online_style]]} />

          <Text style={styles.username}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  //

  handleInUser = user => {
    const { users, setUsers } = this.props;

    let currentUsers = [...users];
    let userIndex = currentUsers.findIndex(item => item.id == user.id);

    if (userIndex != -1) {
      currentUsers[userIndex]["is_online"] = true;
    }

    if (user.id != this.currentUser.id && userIndex == -1) {
      currentUsers.push({
        id: user.id,
        name: user.name,
        is_online: true
      });
    }

    setUsers(sortUsers(currentUsers));
  };


  handleOutUser = user => {
    const { users, setUsers } = this.props;

    let new_users = users.filter(item => {
      if (item.id == user.id) {
        item.is_online = false;
      }
      return item;
    });

    setUsers(sortUsers(new_users));
  };


  beginChat = async user => {
    let roomName = [user.id, this.currentUser.id];
    roomName = roomName.sort().join("_") + "_room";

    let navigation_params = {
      currentUser: this.currentUser,
      roomName: roomName,
      chatWithUser: user.id
    };

    this.props.navigation.navigate("Chat", navigation_params);
  };
}

const mapStateToProps = ({ chat }) => {
  const { users } = chat;
  return {
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUsers: users => {
      dispatch(setUsers(users));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersScreen);

const styles = {
  container: {
    flex: 10,
    alignSelf: "stretch"
  },
  activity: {
    flex: 1,
    alignItems: "center",
    marginTop: 10
  },
  activityText: {
    fontSize: 14,
    color: "#484848"
  },
  body: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  listItemBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10
  },
  online: {
    backgroundColor: "#3ec70f"
  },
  offline: {
    backgroundColor: "#ccc"
  },
  username: {
    marginLeft: 10,
    fontSize: 16
  }
};