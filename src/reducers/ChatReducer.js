import {
  SET_CURRENT_USER,
  SET_CURRENT_ROOM,
  SET_USERS,
  PUT_USER,
  PUT_MESSAGE,
  SET_MESSAGES,
  PUT_OLDER_MESSAGES
} from "../actions/types";

import { offlineActionTypes, reducer as network } from "react-native-offline";

const INITIAL_STATE = {
  isNetworkBannerVisible: false,
  user: null,
  room: null,
  users: [],
  messages: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case offlineActionTypes.CONNECTION_CHANGE:
      if (network.isConnected != action.payload && !action.payload) {
        return { ...state, isNetworkBannerVisible: true };
      } else {
        return { ...state, isNetworkBannerVisible: false };
      }

    case SET_CURRENT_USER:
      return { ...state, user: action.user };

    case SET_CURRENT_ROOM:
      return { ...state, room: action.room };

    case PUT_USER:
      const current_users = [...state.users];
      const users = current_users.concat(action.user);
      return { ...state, users };

    case SET_USERS:
      return { ...state, users: action.users };

    case PUT_USER:
      const user = action.user;
      const loaded_users = [...state.users];
      const user_index = loaded_users.findIndex(item => item.id == user.id);

      if (user_index != -1) {
        loaded_users[user_index]["is_online"] = true;
      }

      let updated_users = loaded_users;
      if (user.id != state.user.id && user_index == -1) {
        updated_users = loaded_users.concat({
          id: user.id,
          name: user.name,
          is_online: true
        });
      }

      return { ...state, ...state.users, ...updated_users };

    case PUT_MESSAGE:
      const updated_messages = [action.message].concat(state.messages);
      return { ...state, messages: updated_messages };

    case SET_MESSAGES: // initialization, refresh
      return { ...state, messages: action.messages };

    case PUT_OLDER_MESSAGES: // load previous messages
      const current_messages = [...state.messages];
      const older_messages = action.messages.reverse();
      const with_old_messages = current_messages.concat(older_messages);

      return {
        ...state,
        messages: with_old_messages
      };

    default:
      return state;
  }
};