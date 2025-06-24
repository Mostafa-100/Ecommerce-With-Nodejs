const extractToken = require("../utils/extractToken");

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const token = extractToken(authorizationHeader);

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode._id);
      if (user) {
        req.user = user;
        return next();
      }
      return next();
    } catch (error) {
      return next();
    }
  }
};

module.exports = verifyToken;
