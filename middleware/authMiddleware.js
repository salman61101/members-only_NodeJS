exports.ensureAuthenticated = (

    req,

    res,

    next

) => {

    if (req.isAuthenticated()) {

        return next();

    }

    res.redirect("/log-in");

};

exports.ensureMember = (
    req,
    res,
    next
) => {
    if (req.isAuthenticated() && (req.user.membership_status || req.user.is_admin)) {
        return next();
    }

    if (!req.isAuthenticated()) {
        return res.redirect("/log-in");
    }

    return res.redirect("/");
};

exports.ensureAdmin = (
    req,
    res,
    next
) => {
    if (req.isAuthenticated() && req.user.is_admin) {
        return next();
    }

    if (!req.isAuthenticated()) {
        return res.redirect("/log-in");
    }

    return res.redirect("/");
};