const authRouter = require("./routes/authRouter");

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", authRouter);
app.get("/", (req, res) => {

    res.render("index", {
        title: "Members Only",
    });

});

const PORT = 3000;



app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});