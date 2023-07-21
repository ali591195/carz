const express = require("express");
const route = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  createMarketPlace,
  getMarketPlaces,
  getMarketPlaceById,
  updateMarketPlace,
  disableMarketPlace,
  getActiveMarketPlaces,
} = require("../../controllers/marketplaces");

route.post("/", protect, createMarketPlace);
route.post(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid marketplace id")],
  protect,
  updateMarketPlace
);
route.post(
  `/disable/:id`,
  [
    body("active").isBoolean().withMessage("Please enter a valid active value"),
    param("id").isUUID(4).withMessage("Please enter a valid market-place id"),
  ],

  protect,
  disableMarketPlace
);

route.get("/", protect, getMarketPlaces);
route.get("/active", protect, getActiveMarketPlaces);
route.get(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid market-place id")],
  protect,
  getMarketPlaceById
);

module.exports = route;
