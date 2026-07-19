const { Router } = require("express");
const authController = require("../controllers/authController");

const authRouter = Router();

// Sign Up
authRouter.get("/sign-up", authController.signUpGet);
authRouter.post("/sign-up", authController.signUpPost);

// Login
authRouter.get("/log-in", authController.loginGet);
authRouter.post("/log-in", authController.loginPost);

// Logout
authRouter.get("/log-out", authController.logout);

module.exports = authRouter;