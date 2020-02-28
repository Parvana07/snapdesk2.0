const express = require("express");

const apiRouter = express.Router();

// require in middleware here
const jwtsController = require("../controllers/jwtsController");
const userController = require("../controllers/userController");
const ticketsController = require("../controllers/ticketsController");
const messageController = require("../controllers/messageController");

// ADD API ROUTES HERE
apiRouter.get(
  "/user",
  jwtsController.isLoggedIn,
  userController.getData,
  (req, res) => res.status(200).json(res.locals)
);

apiRouter.put(
  "/tickets/delete",
  jwtsController.isLoggedIn,
  ticketsController.updateTicketStatus,
  (req, res) => res.status(200).json(res.locals)
);

apiRouter.get(
  "/tickets",
  jwtsController.isLoggedIn,
  ticketsController.getActiveTickets,
  // ticketsController.getResolvedTickets,
  (req, res) => res.status(200).json(res.locals)
);

apiRouter.post(
  "/tickets",
  jwtsController.isLoggedIn,
  ticketsController.addTicket,
  (req, res) => res.status(200).json(res.locals)
);

apiRouter.put(
  "/tickets/accept",
  ticketsController.acceptTicket,
  // ticketsController.updateTicketStatus,
  (req, res) => res.status(200).json(res.locals.result)
);

apiRouter.put(
  "/tickets/resolve",
  ticketsController.updateTicketStatus,
  (req, res) => {
    res.status(200).json(res.locals.status);
  }
);

apiRouter.put(
  "/tickets/decline",
  ticketsController.updateTicketStatus,
  (req, res) => {
    res.status(200).json(res.locals.status);
  }
);

apiRouter.get(
  "/tickets/resolve/display",
  ticketsController.getResolvedTickets,
  (req, res) => {
    // console.log("inside router");
    res.status(200).json(res.locals.resolvedTickets);
  }
);
//
// '/api/chat/newMessage'
apiRouter.post(
  "/chat/newMessage",
  messageController.postMessage,
  (req, res) => {
    // console.log("inside the router");
    res.status(200).json(res.locals.message);
  }
);

apiRouter.get("/chat", messageController.getMessage, (req, res) => {
  console.log("inside router");
  res.status(200).json(res.locals.chatMessages);
});

module.exports = apiRouter;
