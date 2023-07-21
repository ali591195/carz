const asyncHandler = require("express-async-handler");
const {
  HuntingStores,
  validateHuntingStores,
} = require("../models/huntingStores");
const { UserAssignedStores } = require("../models/userAssignedStores");
const { validationResult } = require("express-validator");
const { Users } = require("../models/users");
const { ShippingCharges } = require("../models/shippingCharges");
const sequelize = require("../config/database");
const { shippingChargesCreation } = require("../middleware/commonMiddleware");
const { Op } = require("sequelize");

// @desc Create new store
// @route POST /api/store
// @access Private
const createStore = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  const storeDetail = req.body.store_detail;
  storeDetail.added_by = req.result.id;

  //validate storeDetail
  if (storeDetail) {
    const { error } = validateHuntingStores(storeDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }
  const t = await sequelize.transaction();
  try {
    //check if store exist
    const storeExists = await HuntingStores.findOne({
      where: {
        [Op.or]: [{ name: storeDetail.name }, { link: storeDetail.link }],
      },
    });
    if (storeExists) {
      res.status(400);
      throw new Error("Store already exists with same name or link");
    }

    //create store
    const store = await HuntingStores.create(storeDetail, {
      transaction: t,
    });
    if (!store) {
      res.status(400);
      throw new Error("Store could not be created.");
    }

    //create shipping charges
    if (req.body.shipping_charges.length !== 0) {
      const charges = await shippingChargesCreation(
        req.body.shipping_charges,
        store.id,
        req.result.id,
        t
      );
      if (!charges) {
        res.status(400);
        throw new Error(
          "Shipping charges could not be created. Rollback initiated in shipping charges."
        );
      }
    }
    await t.commit();
    return res.status(200).json({ message: "Store created successfully!" });
  } catch (error) {
    await t.rollback();
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in store creation: " : ""
      }${error.message}`
    );
  }
});

// @desc Update new store
// @route POST /api/store/:id
// @access Private
const updateStore = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const storeDetail = req.body;
  storeDetail.updated_by = req.result.id;

  //validate storeDetail
  if (storeDetail) {
    const { error } = validateHuntingStores(storeDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    //check if store exist
    const storeExistsById = await HuntingStores.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!storeExistsById) {
      res.status(400);
      throw new Error("The store ID you entered does not exist");
    } else {
      //check if user email and cnic already exist
      if (
        storeExistsById.name !== storeDetail.name ||
        storeExistsById.link !== storeDetail.link
      ) {
        const storeExists = await HuntingStores.findOne({
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.ne]: storeExistsById.id,
                },
              },
              {
                [Op.or]: [
                  { name: storeDetail.name },
                  { link: storeDetail.link },
                ],
              },
            ],
          },
        });
        if (storeExists) {
          res.status(400);
          throw new Error("Store already exists with same name or link");
        }
      }
    }

    //update store
    const storeDetails = await HuntingStores.update(storeDetail, {
      where: {
        id: storeExistsById.id,
      },
    });
    if (!storeDetails || storeDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Store could not be updated.");
    }

    return res.status(200).json({ message: "Store updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in store updation: " : ""
      }${error.message}`
    );
  }
});

// @desc disable new store
// @route POST /api/store/disable/:id
// @access Private
const disableStore = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const storeDetail = req.body;
  storeDetail.updated_by = req.result.id;

  try {
    //check if store exist
    const storeExistsById = await HuntingStores.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!storeExistsById) {
      res.status(400);
      throw new Error("The store ID you entered does not exist");
    }

    //freeze store
    const storeDetails = await HuntingStores.update(storeDetail, {
      where: {
        id: storeExistsById.id,
      },
    });
    if (!storeDetails || storeDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Store could not be updated.");
    }

    return res.status(200).json({ message: "Store updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during store updation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get store data
// @route GET /api/store
// @access Private
const getStores = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all HuntingStores
    const stores = await HuntingStores.findAll({
      include: {
        model: Users,
        as: "user_added_hunting_store",
        attributes: ["first_name", "last_name"],
      },
      attributes: ["id", "name", "link", "discount", "active"],
      order: [["createdAt", "DESC"]],
    });
    if (!stores) {
      res.status(400);
      throw new Error("No store found");
    }
    res.status(200).json({
      stores,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching store: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get store data
// @route GET /api/stores/active
// @access Private
const getActiveStores = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all stores
    const store = await HuntingStores.findAll({
      where: { active: true },
      include: {
        model: Users,
        as: "user_added_hunting_store",
        attributes: ["first_name", "last_name"],
      },
      order: [["createdAt", "DESC"]],
    });
    if (!store) {
      res.status(400);
      throw new Error("No store found");
    }
    res.status(200).json({
      store,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching active stores: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get store data by ID
// @route GET /api/store/:id
// @access Private
const getStoreById = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    //find only one store with added by, updated by, assigned user and shipping charges
    const store = await HuntingStores.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Users,
          as: "user_added_hunting_store",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Users,
          as: "user_updated_hunting_store",
          attributes: ["first_name", "last_name"],
        },
        {
          model: UserAssignedStores,
          as: "assigned_store",
          attributes: ["id"],
          include: [
            {
              model: Users,
              as: "store_assigned_to_user",
              attributes: ["first_name", "last_name"],
            },
            {
              model: Users,
              as: "user_added_user_assigned_store",
              attributes: ["first_name", "last_name"],
            },
            {
              model: Users,
              as: "user_updated_user_assigned_store",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
        {
          model: ShippingCharges,
          as: "store_shipping_charges",
          attributes: ["index", "to", "from", "charges"],
          include: [
            {
              model: Users,
              as: "user_added_shipping_charges",
              attributes: ["first_name", "last_name"],
            },
            {
              model: Users,
              as: "user_updated_shipping_charges",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
      ],
      attributes: {
        exclude: ["added_by", "updated_by"],
      },
      order: [
        [
          { model: ShippingCharges, as: "store_shipping_charges" },
          "index",
          "asc",
        ],
      ],
    });
    if (!store) {
      res.status(400);
      throw new Error("Invalid store Id");
    }
    res.status(200).json({
      store,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching user data:"
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createStore,
  updateStore,
  disableStore,
  getStores,
  getStoreById,
  getActiveStores,
};
