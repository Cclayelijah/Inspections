const jwt = require("jsonwebtoken");
const Inspector = require("../models/Inspector"); 

module.exports = function (req, res, next) {
  if (req.user.type === "inspector") {
    if (!req.user.access) {
      // doesn't have manager access
      return res
        .status(401)
        .send("Access Denied. You do not have manager permissions");
    }
  }
  if (req.user.type === "client") return res.status(401).send("Access Denied");
  return next(); // has manager access
};
