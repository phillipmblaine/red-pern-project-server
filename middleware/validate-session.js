const jwt = require("jsonwebtoken");
const User = require("../db").import("../models/user");

const validateSession = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.SIGNATURE, (error, decoded) => {
        if (!error && decoded) {
            User.findOne({ where: { id: decoded.id } })
                .then((user) => {
                    if (!user) throw "error";
                    req.user = user;
                    return next();
                })
                .catch((error) => next(error));
        } else {
            req.errors = error;
            return res.status(500).send("Not Authorized.");
        }
    });
};

module.exports = validateSession;