const express = require("express");
const route = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { body } = require("express-validator");

const {
  createUser,
  loginUser,
  getUser,
} = require("../../controllers/userController");

route.post(
  "/login",
  [
    body("email")
      .isEmail()
      .trim()
      .escape()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password field cannot be empty"),
  ],
  loginUser
);
route.post(
  "/",
  [
    body("full_name")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter your name"),
    body("email")
      .isEmail()
      .trim()
      .escape()
      .withMessage("Please enter a valid email"),
  ],
  createUser
);

route.get("/", protect, getUser);

module.exports = route;
