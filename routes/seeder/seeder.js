const _ = require('lodash');
const express = require('express');
const route = express.Router();

const { saveSeeder } = require('../../controllers/seederController');

route.get('/', saveSeeder);

// const { User, validate } = require('../../models/user/user');
// const debug = require('debug')('app:startup');

// const bcrypt = require('bcrypt');
// const { protect } = require('../../middleware/authMiddleware');

module.exports = route;
