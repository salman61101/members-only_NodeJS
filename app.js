require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const passport = require("./config/passport");
const pool = require("./db/pool");

const authRouter = require("./routes/authRouter");
const membershipRouter = require("./routes/membershipRouter");
const messageRouter = require("./routes/messageRouter");
const homeController = require("./controllers/homeController");

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Sessions
app.use(
    session({
        store: new pgSession({
            pool: pool,
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Make logged-in user available to all EJS views
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use("/", authRouter);
app.use("/", membershipRouter);
app.use("/", messageRouter);

// Home
app.get("/", homeController.indexGet);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});