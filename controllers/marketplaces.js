const asyncHandler = require("express-async-handler");
const {
  Marketplaces,
  validateMarketplaces,
} = require("../models/marketplaces");
const { validationResult } = require("express-validator");
const { Users } = require("../models/users");
const { Op } = require("sequelize");

// @desc Create new marketplace
// @route POST /api/marketplaces
// @access Private
const createMarketPlace = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_marketplace) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  const marketPlaceDetails = req.body;
  marketPlaceDetails.added_by = req.result.id;

  //validate marketPlaceDetails
  if (marketPlaceDetails) {
    const { error } = validateMarketplaces(marketPlaceDetails);
    if (error) return res.status(400).send(error.details[0].message);
  }
  try {
    // check if marketplace exist or not
    const marketPlaceExists = await Marketplaces.findOne({
      where: {
        [Op.or]: [
          { marketplace_id: marketPlaceDetails.marketplace_id },
          { country: marketPlaceDetails.country },
          { country_code: marketPlaceDetails.country_code },
        ],
      },
    });
    if (marketPlaceExists) {
      res.status(400);
      throw new Error("Market-place already exists with same data");
    }

    //create marketPlace
    const marketplace = await Marketplaces.create(marketPlaceDetails);
    if (!marketplace) {
      res.status(400);
      throw new Error("MarketPlace could not be created.");
    }

    return res
      .status(200)
      .json({ message: "Market-place created successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in market-place creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Update new market-place
// @route POST /api/marketplaces/:id
// @access Private
const updateMarketPlace = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_marketplace) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const marketPlaceDetail = req.body;
  marketPlaceDetail.updated_by = req.result.id;

  //validate marketPlaceDetail
  if (marketPlaceDetail) {
    const { error } = validateMarketplaces(marketPlaceDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    //check if market-place exist
    const marketPlaceExistsById = await Marketplaces.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!marketPlaceExistsById) {
      res.status(400);
      throw new Error("The market-place ID you entered does not exist");
    } else {
      //check if marketplace marketplace_id, country or country_code already exist
      if (
        marketPlaceExistsById.marketplace_id !==
          marketPlaceDetail.marketplace_id ||
        marketPlaceExistsById.country !== marketPlaceDetail.country ||
        marketPlaceExistsById.country_code !== marketPlaceDetail.country_code
      ) {
        const marketPlaceExists = await Marketplaces.findOne({
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.ne]: marketPlaceExistsById.id,
                },
              },
              {
                [Op.or]: [
                  { marketplace_id: marketPlaceDetail.marketplace_id },
                  { country: marketPlaceDetail.country },
                  { country_code: marketPlaceDetail.country_code },
                ],
              },
            ],
          },
        });
        if (marketPlaceExists) {
          res.status(400);
          throw new Error("Market-place already exists with same data");
        }
      }
    }

    //update marketplace
    const marketPlaceDetails = await Marketplaces.update(marketPlaceDetail, {
      where: {
        id: marketPlaceExistsById.id,
      },
    });
    if (!marketPlaceDetails || marketPlaceDetails[0] === 0) {
      res.status(400);
      throw new Error(
        "Something went wrong! Market-place could not be updated."
      );
    }

    return res
      .status(200)
      .json({ message: "Market-place updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in market-place updation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc disable market-place
// @route POST /api/marketplaces/disable/:id
// @access Private
const disableMarketPlace = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_marketplace) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const marketPlaceDetail = req.body;
  marketPlaceDetail.updated_by = req.result.id;

  try {
    //check if market-place exist
    const marketPlaceExistsById = await Marketplaces.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!marketPlaceExistsById) {
      res.status(400);
      throw new Error("The market-place ID you entered does not exist");
    }

    //freeze market-place
    const marketPlaceDetails = await Marketplaces.update(marketPlaceDetail, {
      where: {
        id: marketPlaceExistsById.id,
      },
    });
    if (!marketPlaceDetails || marketPlaceDetails[0] === 0) {
      res.status(400);
      throw new Error(
        "Something went wrong! Market-place could not be updated."
      );
    }

    return res
      .status(200)
      .json({ message: "Market-place updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong during updation: " : ""
      }${error.message}`
    );
  }
});

// @desc Get market-place data
// @route GET /api/marketplaces
// @access Private
const getMarketPlaces = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_marketplace) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all Marketplaces
    const marketPlaces = await Marketplaces.findAll({
      include: {
        model: Users,
        as: "user_added_marketplace",
        attributes: ["first_name", "last_name"],
      },
      attributes: [
        "id",
        "marketplace_id",
        "country",
        "country_code",
        "currency",
        "symbol",
        "active",
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!marketPlaces) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      marketPlaces,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching market-Places: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get market_place data
// @route GET /api/market_place/active
// @access Private
const getActiveMarketPlaces = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_marketplace) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active market-places
    const store = await Marketplaces.findAll({
      where: { active: true },
      include: {
        model: Users,
        as: "user_added_marketplace",
        attributes: ["first_name", "last_name"],
      },
      order: [["createdAt", "DESC"]],
    });
    if (!store) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      store,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching active market-places: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get market_place data by ID
// @route GET /api/market_place/:id
// @access Private
const getMarketPlaceById = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_marketplace) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    //find only one market_place with added by, updated by, and permission settings
    const marketPlace = await Marketplaces.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Users,
          as: "user_added_marketplace",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Users,
          as: "user_updated_marketplace",
          attributes: ["first_name", "last_name"],
        },
      ],
      attributes: {
        exclude: ["added_by", "updated_by"],
      },
    });
    if (!marketPlace) {
      res.status(400);
      throw new Error("Invalid market-place Id");
    }
    res.status(200).json({
      marketPlace,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching market-place data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createMarketPlace,
  updateMarketPlace,
  disableMarketPlace,
  getMarketPlaces,
  getMarketPlaceById,
  getActiveMarketPlaces,
};
