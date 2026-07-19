const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.signUpGet = (req, res) => {
    res.render("sign-up", {
        title: "Create Account",
        errors: [],
        oldData: {},
    });
};

exports.signUpPost = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("username")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email")
        .custom(async (value) => {
            const existingUser = await db.getUserByUsername(value);

            if (existingUser) {
                throw new Error("Email already exists");
            }

            return true;
        }),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.render("sign-up", {

                title: "Create Account",

                errors: errors.array(),

                oldData: req.body,

            });

        }

        const hashedPassword =
            await bcrypt.hash(req.body.password, 10);

        await db.createUser(

            req.body.firstName,

            req.body.lastName,

            req.body.username,

            hashedPassword

        );

        res.redirect("/log-in");

    },



    
];


exports.loginGet = (req, res) => {
    res.render("login", {
        title: "Login",
        errors: [],
        oldData: {},
    });
};

exports.loginPost = [
    body("username")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("login", {
                title: "Login",
                errors: errors.array(),
                oldData: req.body,
            });
        }

        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(400).render("login", {
                    title: "Login",
                    errors: [{ msg: "Incorrect email or password" }],
                    oldData: req.body,
                });
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }

                return res.redirect("/");
            });
        })(req, res, next);
    },
];


exports.logout = (

    req,

    res,

    next

) => {

    req.logout((err) => {

        if (err) {

            return next(err);

        }

        res.redirect("/");

    });

};