const express = require("express");
const route = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  assignStore,
  updateAssignedStore,
  deleteAssignedStore,
} = require("../../controllers/assignHuntingStore");

route.post("/", protect, assignStore);
route.post(
  `/:id`,
  [
    body("assigned_store")
      .isUUID(4)
      .withMessage("Please enter a valid store id"),
    param("id").isUUID(4).withMessage("Please enter a valid user id"),
  ],
  protect,
  updateAssignedStore
);

route.post(
  `/delete/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid assigned store id")],
  protect,
  deleteAssignedStore
);

module.exports = route;
