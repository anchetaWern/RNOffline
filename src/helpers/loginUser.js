import { ChatManager, TokenProvider } from "@pusher/chatkit";

import { setCurrentUser } from "../actions";

const instanceLocatorId = "YOUR INSTANCE LOCATOR ID";

const loginUser = async (username) => {

  try {
    const chatManager = new ChatManager({
      instanceLocator: `v1:us1:${instanceLocatorId}`,
      userId: username,
      tokenProvider: new TokenProvider({
        url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${instanceLocatorId}/token`
      })
    });

    const currentUser = await chatManager.connect();

    setCurrentUser({
      id: currentUser.id,
      username: username
    });

    return currentUser;

  } catch (e) {
    console.log("error with chat manager: ", e);
    throw "Error with chat manager";
  }

};

export default loginUser;