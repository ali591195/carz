const express = require("express");
const route = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  createShippingCharges,
  updateShippingCharges,
} = require("../../controllers/shippingCharges");

route.post(
  "/",
  [body("store_id").isUUID(4).withMessage("Please enter a valid store id")],
  protect,
  createShippingCharges
);
route.post(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid store id")],
  protect,
  updateShippingCharges
);

module.exports = route;
