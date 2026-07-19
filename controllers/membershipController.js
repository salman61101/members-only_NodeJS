const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.joinGet = (req, res) => {
    res.render("join", {
        title: "Join Club",
        errors: [],
        oldData: {},
    });
};

exports.joinPost = [
    body("passcode")
        .trim()
        .notEmpty()
        .withMessage("Secret passcode is required")
        .custom((value) => {
            if (value !== process.env.CLUB_PASSCODE) {
                throw new Error("Invalid secret passcode");
            }

            return true;
        }),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("join", {
                    title: "Join Club",
                    errors: errors.array(),
                    oldData: req.body,
                });
            }

            await db.updateUserMembershipStatus(req.user.id, true);

            return res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
];

exports.becomeAdminGet = (req, res) => {
    res.render("becomeAdmin", {
        title: "Become Admin",
        errors: [],
        oldData: {},
    });
};

exports.becomeAdminPost = [
    body("passcode")
        .trim()
        .notEmpty()
        .withMessage("Admin passcode is required")
        .custom((value) => {
            if (value !== process.env.ADMIN_PASSCODE) {
                throw new Error("Invalid admin passcode");
            }

            return true;
        }),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("becomeAdmin", {
                    title: "Become Admin",
                    errors: errors.array(),
                    oldData: req.body,
                });
            }

            await db.updateUserAdminStatus(req.user.id, true);

            return res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
];