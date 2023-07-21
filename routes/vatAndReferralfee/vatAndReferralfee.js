const express = require("express");
const route = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  createVatAndReferralFee,
  getMainCategorys,
  getSubCategorys,
  getCategoryById,
  updateCategory,
  disableMarketPlace,
  getActiveAllCategorys,
  getActiveMainCategorys,
  getActiveSubCategorys,
} = require("../../controllers/vatAndReferralfee");

route.post("/", protect, createVatAndReferralFee);
route.post(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid category id")],
  protect,
  updateCategory
);
route.post(
  `/disable/:id`,
  [
    body("active").isBoolean().withMessage("Please enter a valid active value"),
    param("id").isUUID(4).withMessage("Please enter a valid category id"),
  ],

  protect,
  disableMarketPlace
);

route.get("/main", protect, getMainCategorys);
route.get("/sub", protect, getSubCategorys);
route.get("/active/all", protect, getActiveAllCategorys);
route.get("/active/main", protect, getActiveMainCategorys);
route.get("/active/sub", protect, getActiveSubCategorys);
route.get(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid category id")],
  protect,
  getCategoryById
);

module.exports = route;
