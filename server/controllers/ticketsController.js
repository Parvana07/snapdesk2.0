/**
 * ************************************
 *
 * @author Joshua
 * @date 2/21/20
 * @description get tickets data from db middleware
 *
 * ************************************
 */

// import access to database
const db = require("../models/userModel");

const ticketsController = {};

ticketsController.getActiveTickets = (req, res, next) => {
  const getActiveTickets = `
    SELECT t._id, t.snaps_given, t.message, t.status, t.timestamp, t.mentee_id, u.name mentee_name, mentor_id
    FROM tickets t
    INNER JOIN users u
    ON u._id = t.mentee_id
    WHERE status = 'active'
    OR status = 'pending'
    ORDER BY t._id
  `;
  db.query(getActiveTickets)
    .then(({ rows }) => {
      const formatTickets = rows.map(ticket => ({
        messageInput: ticket.message,
        messageRating: ticket.snaps_given,
        messageId: ticket._id,
        menteeId: ticket.mentee_id,
        menteeName: ticket.mentee_name,
        timestamp: ticket.timpestamp,
        status: ticket.status,
        mentorId: ticket.mentor_id
      }));
      res.locals.activeTickets = formatTickets;
      // console.log(res.locals.activeTickets);
      return next();
    })
    .catch(err =>
      next({
        log: `Error in middleware ticketsController.getActiveTicket: ${err}`
      })
    );
};

ticketsController.addTicket = (req, res, next) => {
  const { snaps_given, mentee_id, status, message } = req.body;
  const addTicket = {
    text: `
      INSERT INTO tickets
      (snaps_given, mentee_id, status, message, timestamp)
      VALUES
      ($1, $2, $3, $4, NOW())
      RETURNING _id, timestamp, mentee_id;
    `,
    values: [snaps_given, mentee_id, status, message]
  };
  db.query(addTicket)
    .then(ticket => {
      res.locals.ticketId = ticket.rows[0]._id;
      res.locals.timestamp = ticket.rows[0].timestamp;
      res.locals.menteeId = ticket.rows[0].mentee_id;
      return next();
    })
    .catch(err =>
      next({
        log: `Error in middleware ticketsController.addTicket: ${err}`
      })
    );
};

ticketsController.updateTicketStatus = (req, res, next) => {
  const { ticketId, status } = req.body;
  // console.log("req.body inside updateTicketStatus", req.body);
  const updateTicket = {
    text: `
      UPDATE tickets
      SET status = $1
      WHERE _id = $2
      RETURNING *;
    `,
    values: [status, ticketId]
  };

  db.query(updateTicket)
    .then(result => {
      // console.log(result);
      // console.log("db success, result.rows", result.rows);
      res.locals.status = result.rows[0];
      return next();
    })
    .catch(err =>
      next({
        log: `Error in middleware ticketsController.updateTicketStatus: ${err}`
      })
    );
};

ticketsController.acceptTicket = (req, res, next) => {
  console.log(req.body);
  const { ticketId, mentorId, status } = req.body;
  const addMentorId = {
    text: `
      UPDATE tickets
      SET
      mentor_id = $2, status=$3 WHERE _id = $1 
      RETURNING *
    `,
    values: [ticketId, mentorId, status]
  };

  db.query(addMentorId)
    .then(result => {
      // console.log(result.rows);
      res.locals.result = result.rows[0];
      return next();
    })
    .catch(err =>
      next({
        log: `Error in middleware ticketsController.acceptTicket: ${err}`
      })
    );
};

ticketsController.getResolvedTickets = (req, res, next) => {
  const resolvedTickets = `
    SELECT t._id, t.snaps_given, t.message, t.status, t.timestamp, t.mentee_id, u.name mentee_name
    FROM tickets t
    INNER JOIN users u
    ON u._id = t.mentee_id
    WHERE status = 'resolve'
    ORDER BY t._id;
  `;
  db.query(resolvedTickets)
    .then(({ rows }) => {
      const formatTickets = rows.map(ticket => ({
        messageInput: ticket.message,
        messageRating: ticket.snaps_given,
        messageId: ticket._id,
        menteeId: ticket.mentee_id,
        menteeName: ticket.mentee_name,
        timestamp: ticket.timpestamp,
        status: ticket.status,
        mentorId: ticket.mentor_id || ""
      }));
      res.locals.resolvedTickets = formatTickets;

      // console.log(res.locals.resolvedTickets);
      // console.log(formatTickets);
      return next();
    })

    .catch(err =>
      next({
        log: `Error in middleware ticketsController.getResolvedTickets: ${err}`
      })
    );
};

// ticketsController.getResolvedTickets = (req, res, next) => {
//   const { ticketId, status } = req.body;
//   const resolvedMessage = {
//     text: `SELECT message, timestamp FROM tickets WHERE tickets._id = $1 AND status = $2`,
//     values: [ticketId, status]
//   };
//   db.query(resolvedMessage)
//     .then(result => {
//       console.log(result);
//       return next();
//     })
//     .catch(err => {
//       next({
//         log: `Error in middleware ticketsController.getResolvedMessages: ${err}`
//       });
//     });
// };

module.exports = ticketsController;
