const asyncHandler = require("express-async-handler");
const {
  ShippingCharges,
  validateShippingCharges,
} = require("../models/shippingCharges");
const { validationResult } = require("express-validator");
const {
  shippingChargesCreation,
  destoryStoreShippingCharges,
} = require("../middleware/commonMiddleware");
const { Op } = require("sequelize");
const { HuntingStores } = require("../models/huntingStores");

// @desc Create new shipping charges
// @route POST /api/shipping_charges
// @access Private
const createShippingCharges = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //check if store exist
    const store = await HuntingStores.findOne({
      where: {
        [Op.and]: [
          {
            id: req.body.store_id,
          },
          { active: true },
        ],
      },
    });
    if (!store) {
      throw new Error("Invalid store ID");
    }

    // call middleware to create shipping charges
    const charges = await shippingChargesCreation(
      req.body.shipping_charges,
      req.body.store_id,
      req.result.id,
      false
    );

    if (!charges) {
      res.status(400);
      throw new Error("Error occur during shipping charges creation.");
    }

    return res
      .status(200)
      .json({ message: "Shipping charges created successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during shipping charges creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Update new store
// @route POST /api/shipping_charges/:id
// @access Private
const updateShippingCharges = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //first check store and destory all shipping charges values of that store
    const store = await destoryStoreShippingCharges(req.params.id);

    if (!store.result || store.result[0] === 0) {
      res.status(400);
      throw new Error(
        "Something went wrong! Store shipping charges could not be deleted."
      );
    }

    //create array of new data
    const chargesDetail = req.body.shipping_charges;
    chargesDetail.map((c, i) => {
      c.index = i;
      c.store_id = req.params.id;
      c.added_by = store.added_by;
      c.updated_by = req.result.id;
      c.to = c.to === "" ? null : c.to;
      c.from = c.from === "" ? null : c.from;
      c.charges = c.charges === "" ? null : c.charges;
    });

    //validate shipping charges
    if (chargesDetail) {
      chargesDetail.map((c) => {
        const { error } = validateShippingCharges(c);
        if (error) {
          throw new Error(error.details[0].message);
        }
      });
    }

    //create new charges with old added_by id
    const shippingCharges = await ShippingCharges.bulkCreate(chargesDetail);
    if (!shippingCharges) {
      res.status(400);
      throw new Error("Error occur during shipping charges updation.");
    }

    return res
      .status(200)
      .json({ message: "Shipping charges updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during shipping charges updation: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createShippingCharges,
  updateShippingCharges,
};
