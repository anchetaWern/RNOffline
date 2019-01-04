import {
  SET_CURRENT_USER,
  SET_CURRENT_ROOM,
  SET_USERS,
  PUT_USER,
  PUT_MESSAGE,
  SET_MESSAGES,
  PUT_OLDER_MESSAGES
} from "./types";

import sortUsers from "../helpers/sortUsers";

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    user
  };
};

export const setCurrentRoom = room => {
  return {
    type: SET_CURRENT_ROOM,
    room
  };
};

export const setUsers = users => {
  return {
    type: SET_USERS,
    users: sortUsers(users)
  };
};

export const putUser = user => {
  return {
    type: PUT_USER,
    user
  };
};

export const putMessage = message => {
  return {
    type: PUT_MESSAGE,
    message
  };
};

export const setMessages = messages => {
  return {
    type: SET_MESSAGES,
    messages
  };
};

export const putOlderMessages = messages => {
  return {
    type: PUT_OLDER_MESSAGES,
    messages
  };
};