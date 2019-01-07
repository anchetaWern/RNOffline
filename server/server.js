const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

const app = express();

const instance_locator_id = "YOUR CHATKIT INSTANCE LOCATOR ID";
const chatkit_secret = "YOUR CHATKIT SECRET";

const chatkit = new Chatkit.default({
  instanceLocator: `v1:us1:${instance_locator_id}`,
  key: chatkit_secret
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("all green!");
});

let rooms = [];

app.post("/users", async (req, res) => {
  const { user_id, username } = req.body;

  try {
    let user = await chatkit.createUser({
      id: user_id,
      name: username
    });

    res.sendStatus(200);
  } catch (err) {
    if (err.error === "services/chatkit/user_already_exists") {
      console.log("user already exists!");
      res.sendStatus(201);
    } else {
      console.log("error occurred: ", err);
      let statusCode = err.error.status;
      if (statusCode >= 100 && statusCode < 600) {
        res.status(statusCode);
      } else {
        res.status(500);
      }
    }
  }
});

app.post("/rooms", async (req, res) => {
  const { user_id, room_name } = req.body;

  try {
    let user_rooms = await chatkit.getUserRooms({
      userId: user_id
    });

    let chat_room = user_rooms.find((room) => {
      return room.name == room_name;
    });

    if (!chat_room) {
      let user_joinable_rooms = await chatkit.getUserJoinableRooms({
        userId: user_id
      });

      let found_rooms = user_joinable_rooms.find((room) => {
        return room.name == room_name;
      });

      if (!found_rooms) {
        chat_room = await chatkit.createRoom({
          creatorId: user_id,
          name: room_name
        });
      }
    }

    res.send(chat_room);

  } catch (e) {
    console.log("error getting user rooms: ", e);
  }

});

const PORT = 3000;
app.listen(PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on ports ${PORT}`);
  }
});