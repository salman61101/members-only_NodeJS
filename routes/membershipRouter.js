const { Router } = require("express");

const membershipController = require("../controllers/membershipController");
const { ensureAuthenticated, ensureMember } = require("../middleware/authMiddleware");

const membershipRouter = Router();

membershipRouter.get("/join", ensureAuthenticated, membershipController.joinGet);
membershipRouter.post("/join", ensureAuthenticated, membershipController.joinPost);

membershipRouter.get("/become-admin", ensureMember, membershipController.becomeAdminGet);
membershipRouter.post("/become-admin", ensureMember, membershipController.becomeAdminPost);

module.exports = membershipRouter;