const { Router } = require("express");

const messageController = require("../controllers/messageController");
const { ensureAuthenticated, ensureAdmin } = require("../middleware/authMiddleware");

const messageRouter = Router();

messageRouter.get("/messages/new", ensureAuthenticated, messageController.newMessageGet);
messageRouter.post("/messages/new", ensureAuthenticated, messageController.newMessagePost);
messageRouter.post("/messages/:id/delete", ensureAdmin, messageController.deleteMessagePost);

module.exports = messageRouter;