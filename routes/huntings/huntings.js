const express = require("express");
const route = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  uniqueASIN,
  uniqueSKU,
  getHuntings,
  createHuntings,
} = require("../../controllers/huntingsController");

route.get("/", protect, getHuntings);
route.get("/uniqueASIN", uniqueASIN);
route.get("/uniqueSKU", uniqueSKU);

route.post("/", protect, createHuntings);

// const { User, validate } = require('../../models/user/user');
// const debug = require('debug')('app:startup');

// const bcrypt = require('bcrypt');
// const { protect } = require('../../middleware/authMiddleware');

module.exports = route;
