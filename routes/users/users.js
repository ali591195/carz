const express = require("express");
const route = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  freezeUser,
  getActiveUsers,
  getActiveUsersWithoutStores,
  getUser,
  getAllUsers,
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
route.post(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid user id")],
  protect,
  updateUser
);
route.post(
  `/freeze/:id`,
  [
    body("active").isBoolean().withMessage("Please enter a valid active value"),
    param("id").isUUID(4).withMessage("Please enter a valid user id"),
  ],
  protect,
  freezeUser
);
route.get("/", protect, getUser);
route.get("/all", protect, getAllUsers);
route.get("/active", protect, getActiveUsers);
route.get("/active/without_store", protect, getActiveUsersWithoutStores);
route.get(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid user id")],
  protect,
  getUserById
);

module.exports = route;
