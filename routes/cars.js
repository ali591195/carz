const express = require("express");
const route = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { body, param } = require("express-validator");

const {
  createCar,
  updateCar,
  deleteCar,
  getCars,
} = require("../controllers/cars");

route.post(
  "/",
  [
    body("name").isString().trim().escape().withMessage("Please enter a name"),
    body("category_id")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter category id"),
    protect,
  ],
  createCar
);
route.put(
  `/:id`,
  [
    body("name").isString().trim().escape().withMessage("Please enter a name"),
    body("category_id")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter category id"),
    param("id").isUUID(4).withMessage("Please enter a valid category id"),
  ],
  protect,
  updateCar
);
route.delete(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid category id")],
  protect,
  deleteCar
);
route.get(`/`, protect, getCars);

module.exports = route;
