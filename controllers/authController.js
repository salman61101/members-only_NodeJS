const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

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
        .withMessage("Enter a valid email"),

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

        const existingUser =
            await db.getUserByUsername(req.body.username);

        if (existingUser) {

            return res.render("sign-up", {

                title: "Create Account",

                errors: [
                    {
                        msg: "Email already exists",
                    },
                ],

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