import { combineReducers } from "redux";
import ChatReducer from "./ChatReducer";

import { reducer as network } from "react-native-offline";

export default combineReducers({
  chat: ChatReducer,
  network
});
