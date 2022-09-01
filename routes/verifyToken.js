const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token)
    return res
      .status(401)
      .json({ message: "Failed to Authenticate", isLoggedIn: false });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    return next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token", isLoggedIn: false });
  }
};
