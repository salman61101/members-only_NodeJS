const db = require("../db/queries");

exports.indexGet = async (req, res, next) => {
    try {
        const messages = await db.getAllMessages();

        res.render("index", {
            title: "Members Only",
            messages,
        });
    } catch (err) {
        next(err);
    }
};