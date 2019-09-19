module.exports = function aqdmin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied"); // no try-catch needed for booleans
  next();
};
