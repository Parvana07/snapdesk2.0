const db = require("../models/userModel");

const messageController = {};

messageController.postMessage = (req, res, next) => {
  //   console.log("i am a body", req.body);
  const { userId, userName, message } = req.body;

  const addMessage = {
    text: `
        INSERT INTO chats (user_id, user_name, message, timestamp)
        VALUES
        ($1, $2, $3, NOW())
        RETURNING *
        `,
    values: [userId, userName, message]
  };
  db.query(addMessage)
    .then(success => {
      //   console.log("saved in db", success);
      res.locals.message = success.rows[0];
      return next();
    })
    .catch(err =>
      next({
        log: `Error in middleware ticketsController.getMessage: ${err}`
      })
    );
};

messageController.getMessage = (req, res, next) => {
  const getMessage = {
    text: `
        SELECT user_id, user_name, message, timestamp FROM chats`
  };
  db.query(getMessage)
    .then(result => {
      //   console.log("query successful", result);
      console.log(result.rows[0]);
      const chatMessages = result.rows.map(message => ({
        userId: message.user_id,
        userName: message.user_name,
        message: message.message,
        timestamp: message.timestamp
      }));
      res.locals.chatMessages = chatMessages;
      console.log(res.locals.chatMessages);
      return next();
    })
    .catch(err =>
      next({
        log: `Error in middleware ticketsController.getMessage: ${err}`
      })
    );
};

module.exports = messageController;
