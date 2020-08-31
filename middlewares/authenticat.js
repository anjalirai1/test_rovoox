const config = require("../config/config");
const jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
  console.log("Request inside authentication", req.headers, config.secret);
  const token = req.headers["authorization"];
  console.log(token);
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, config.secret, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
