const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); // returns payload of jwt or trows exception if not valid
    req.user = decoded; // adds payload to req chain
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
