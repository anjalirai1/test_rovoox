const config = require("../config/config");
const jwt = require("jsonwebtoken");

module.exports = function generateAccessToken(username) {
  console.log(config.secret);
  return jwt.sign(username, config.secret, { expiresIn: "1800s" });
};
