const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(400).send("Access Denied");
  try {
    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verify;

    next();
  } catch (err) {
    res.status(404).send("Invalid Token");
  }
};
