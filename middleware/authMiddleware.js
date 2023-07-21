const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { Users } = require("../models/users");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers["x-auth-token"]) {
    try {
      //Get token from header
      token = req.headers["x-auth-token"];

      //verfiy token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from token
      req.result = await Users.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });
      if (!req.result) {
        throw new Error("Not authorized, no token.");
      }
      next();
    } catch (err) {
      res.status(401);
      throw new Error(err);
    }
  }

  res.status(401);
  throw new Error("Not authorized, no token.");
});

module.exports = {
  protect,
};
