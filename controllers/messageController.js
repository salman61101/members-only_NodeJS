const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.newMessageGet = (req, res) => {
    res.render("newMessage", {
        title: "Create Message",
        errors: [],
        oldData: {},
    });
};

exports.newMessagePost = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 120 })
        .withMessage("Title must be 120 characters or fewer"),
    body("text")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ min: 3 })
        .withMessage("Message must be at least 3 characters"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("newMessage", {
                    title: "Create Message",
                    errors: errors.array(),
                    oldData: req.body,
                });
            }

            await db.createMessage(req.body.title, req.body.text, req.user.id);

            return res.redirect("/");
        } catch (err) {
            next(err);
        }
    },
];

exports.deleteMessagePost = async (req, res, next) => {
    try {
        await db.deleteMessageById(req.params.id);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
};