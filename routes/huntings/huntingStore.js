const express = require("express");
const route = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  disableStore,
  getActiveStores,
} = require("../../controllers/huntingStoreController");

route.post("/", protect, createStore);
route.post(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid store id")],
  protect,
  updateStore
);
route.post(
  `/disable/:id`,
  [
    body("active").isBoolean().withMessage("Please enter a valid active value"),
    param("id").isUUID(4).withMessage("Please enter a valid store id"),
  ],

  protect,
  disableStore
);

route.get("/", protect, getStores);
route.get("/active", protect, getActiveStores);
route.get(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid store id")],
  protect,
  getStoreById
);

module.exports = route;
