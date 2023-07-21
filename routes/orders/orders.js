const _ = require('lodash');
const express = require('express');
const route = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const { getOrder } = require('../../controllers/orderController');

route.get('/', getOrder);

// const { User, validate } = require('../../models/user/user');
// const debug = require('debug')('app:startup');

// const bcrypt = require('bcrypt');
// const { protect } = require('../../middleware/authMiddleware');

module.exports = route;
