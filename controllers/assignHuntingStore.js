const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const asyncHandler = require("express-async-handler");
const {
  UserAssignedStores,
  validateUserAssignedStore,
} = require("../models/userAssignedStores");
const { HuntingStores } = require("../models/huntingStores");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Users } = require("../models/users");
const { assignStoreMiddelware } = require("../middleware/commonMiddleware");

// @desc Create new store
// @route POST /api/assign_store
// @access Private
const assignStore = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    const assignedStore = await assignStoreMiddelware(
      req.body.assigned_user,
      req.body.assigned_store,
      req.result.id,
      true,
      false
    );

    if (!assignedStore) {
      res.status(400);
      throw new Error("Error occur during store assignement.");
    }

    return res.status(200).json({ message: "Store assigned successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during store assignment: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Update new store
// @route POST /api/assign_store/:id
// @access Private
const updateAssignedStore = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check if store exist
    const storeAssigned = await UserAssignedStores.findOne({
      where: {
        assigned_user: req.params.id,
      },
    });
    if (!storeAssigned) {
      res.status(400);
      throw new Error("No assignment found! or invalid userId");
    }
    //check if store exist
    if (storeAssigned.assigned_store !== req.body.assigned_store) {
      const storeExists = await HuntingStores.findOne({
        where: {
          [Op.and]: [
            {
              id: req.body.assigned_store,
            },
            { active: true },
          ],
        },
      });
      if (!storeExists) {
        res.status(400);
        throw new Error("Invalid store ID");
      }
    }
    const updatedata = new Object();
    updatedata.assigned_store = req.body.assigned_store;
    updatedata.updated_by = req.result.id;

    //update assigned store
    const storeDetails = await UserAssignedStores.update(updatedata, {
      where: {
        assigned_user: req.params.id,
      },
    });
    if (!storeDetails || storeDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Store could not be updated.");
    }

    return res
      .status(200)
      .json({ message: "Assigned store updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while updating store assignment: "
          : ""
      }${error.message}`
    );
  }
});

// @desc disable new store
// @route POST /api/UserAssignedStores/disable/:id
// @access Private
const deleteAssignedStore = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_store) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validateUserAssignedStore input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    //check if store assignment exist
    const storeAssignedExist = await UserAssignedStores.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!storeAssignedExist) {
      res.status(400);
      throw new Error("The store ID you entered does not exist");
    }

    //destory store
    const storeDetails = await UserAssignedStores.destroy({
      where: {
        id: storeAssignedExist.id,
      },
    });
    if (!storeDetails || storeDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Store could not be deleted.");
    }

    return res.status(200).json({ message: "Store deleted successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while deleteing store assignement: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  assignStore,
  updateAssignedStore,
  assignStoreMiddelware,
  deleteAssignedStore,
};
