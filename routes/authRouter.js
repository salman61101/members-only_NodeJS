const { Router } = require("express");

const authController =
require("../controllers/authController");

const authRouter = Router();

authRouter.get(
    "/sign-up",
    authController.signUpGet
);

authRouter.post(
    "/sign-up",
    authController.signUpPost
);

authRouter.get("/log-in",(req,res)=>{

    res.render("login");

});
module.exports = authRouter;