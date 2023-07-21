const asyncHandler = require("express-async-handler");
const {
  VatReferralJunctions,
  validateVatReferralJunctions,
} = require("../models/vatReferralJunction");
const { validationResult } = require("express-validator");
const { Users } = require("../models/users");
const { Op } = require("sequelize");
const { Marketplaces } = require("../models/marketplaces");
const { Categorys } = require("../models/categories");
const {
  createReferralFeeCreation,
  createVat,
  createVatReferralJunction,
  createReferralFee,
  createVatReferralJunctionBulk,
  createReferralFeeBulk,
} = require("../middleware/commonMiddleware");
const { VAT } = require("../models/vat");
const sequelize = require("../config/database");

// @desc Create new vat
// @route POST /api/vat
// @access Private
const createVatAndReferralFee = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  const vatReferralJunctionData = req.body.marketplaceCategory;
  vatReferralJunctionData.added_by = req.result.id;

  //validate vatReferralJunctionData for vatReferralJunction tavle
  if (vatReferralJunctionData) {
    const { error } = validateVatReferralJunctions(vatReferralJunctionData);
    if (error) return res.status(400).send(error.details[0].message);
  }

  const t = await sequelize.transaction();
  try {
    // check if same marketplace and category exists in vatReferralJunction table
    const junctionExists = await VatReferralJunctions.findOne({
      where: {
        [Op.and]: [
          {
            marketplace_id: vatReferralJunctionData.marketplace_id,
          },
          {
            category_id: vatReferralJunctionData.category_id,
          },
        ],
      },
    });
    if (junctionExists) {
      // check if above juction id exists in vat table or not
      const marketplaceCategoryExists = await VAT.findOne({
        where: {
          marketplace_category_junction_id: junctionExists.id,
        },
      });
      if (marketplaceCategoryExists) {
        res.status(400);
        throw new Error(
          "Vat already exists with same marketplace and category"
        );
      } else {
        const vatCreation = await createVat(
          req.body.vat.value,
          junctionExists.id,
          req.result.id,
          t
        );
        if (!vatCreation) {
          res.status(400);
          throw new Error(
            "Vat could not be created. Rollback initiated in vat creation."
          );
        }
        await t.commit();
        return res.status(200).json({ message: "Vat created successfully!" });
      }
    } else {
      //now we need to create vatReferralJuntion entry with given marketplace and category
      const vatReferraljunctionCreation = await createVatReferralJunction(
        vatReferralJunctionData,
        t
      );
      if (!vatReferraljunctionCreation.result) {
        res.status(400);
        throw new Error(
          "Market-place and category junction could not be created. Rollback initiated in Market-place and category junction creation."
        );
      }

      // create vat with above junction id
      const vatCreation = await createVat(
        req.body.vat.value,
        vatReferraljunctionCreation.result.id,
        vatReferraljunctionCreation.result.added_by,
        t
      );
      if (!vatCreation) {
        res.status(400);
        throw new Error(
          "Vat could not be created. Rollback initiated in vat creation."
        );
      }

      // create referral fee with above referral vale
      const referralFeeCreation = await createReferralFee(
        req.body.referralFee,
        vatReferraljunctionCreation.result.id,
        vatReferraljunctionCreation.result.added_by,
        t
      );
      if (!referralFeeCreation) {
        res.status(400);
        throw new Error(
          "Referral fee could not be created. Rollback initiated in referral fee creation."
        );
      }

      // now check if vatReferraljunctionCreation.category has some childs or not
      if (
        vatReferraljunctionCreation.category.parent_category === null &&
        vatReferraljunctionCreation.category.child_categories.length !== 0
      ) {
        // bulk create vatReferralJunction with above childs, marketplace, and minReferralfee value
        const bulkCreateJunction = await createVatReferralJunctionBulk(
          vatReferraljunctionCreation.category.child_categories,
          vatReferraljunctionCreation.result.marketplace_id,
          vatReferraljunctionCreation.result.min_referral_fee,
          vatReferraljunctionCreation.result.added_by,
          t
        );
        if (!bulkCreateJunction) {
          res.status(400);
          throw new Error(
            "Marketplace and child categories junction could not be created. Rollback initiated in bulk marketplace and categories creation with child categories creation."
          );
        }

        // create referralfee with above bulkCreateJunction IDs and given referral fee data
        const childCatReferralFeeCreation = await createReferralFeeBulk(
          req.body.referralFee,
          bulkCreateJunction,
          vatReferraljunctionCreation.result.added_by,
          t
        );
        if (!childCatReferralFeeCreation) {
          res.status(400);
          throw new Error(
            "Referral fee of child categories could not be created. Rollback initiated in bulk referral fee creation of child categories."
          );
        }
      }
      await t.commit();
      return res
        .status(200)
        .json({ message: "Vat and Referral fee created successfully!" });
    }
  } catch (error) {
    await t.rollback();
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in Vat and Referral fee creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Update new market-place
// @route POST /api/vat/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const categoryDetail = req.body;
  categoryDetail.updated_by = req.result.id;

  //validate categoryDetail
  if (categoryDetail) {
    const { error } = validateVatReferralJunctions(categoryDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    //check if market-place exist
    const categoryExistsById = await VAT.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryExistsById) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    } else {
      //check if category name with parent same id exist
      if (
        categoryExistsById.name !== categoryDetail.name ||
        categoryExistsById.parent_category !== categoryDetail.parent_category
      ) {
        const categoryExists = await VAT.findOne({
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.ne]: categoryExistsById.id,
                },
              },
              {
                [Op.and]: [
                  {
                    parent_category: categoryDetail.parent_category,
                  },
                  {
                    name: categoryDetail.name,
                  },
                ],
              },
            ],
          },
        });
        if (categoryExists) {
          res.status(400);
          throw new Error("Category already exists with same name");
        }
        //if there is a parent category then check if it exists or not
        if (
          categoryExistsById.parent_category !==
            categoryDetail.parent_category &&
          categoryDetail.parent_category
        ) {
          const parentExists = await VAT.findOne({
            where: {
              [Op.and]: [
                {
                  id: categoryDetail.parent_category,
                },
                {
                  parent_category: {
                    [Op.eq]: null,
                  },
                },
                { active: true },
              ],
            },
          });
          if (!parentExists) {
            res.status(400);
            throw new Error("Invalid parent-category ID!");
          }
        }
      }
    }
    //update category
    const categoryDetails = await VAT.update(categoryDetail, {
      where: {
        id: categoryExistsById.id,
      },
    });
    if (!categoryDetails || categoryDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Category could not be updated.");
    }

    return res.status(200).json({ message: "Category updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category updation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc disable category
// @route POST /api/vat/disable/:id
// @access Private
const disableMarketPlace = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const categoryDetail = req.body;
  categoryDetail.updated_by = req.result.id;

  try {
    //check if category exist
    const categoryExistsById = await VAT.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Categorys,
        as: "child_categories",
        attributes: ["id"],
      },
    });
    if (!categoryExistsById) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }
    if (
      categoryExistsById.parent_category === null &&
      categoryExistsById.child_categories.length !== 0
    ) {
      const childCategory = [];
      categoryExistsById.child_categories.map((childCat) => {
        childCategory.push(childCat.id);
      });

      const childCategoryDetails = await VAT.update(categoryDetail, {
        where: {
          id: [childCategory, categoryExistsById.id],
        },
      });
      if (!childCategoryDetails || childCategoryDetails[0] === 0) {
        res.status(400);
        throw new Error("Something went wrong! Category could not be updated.");
      }
    } else {
      const categoryDetails = await VAT.update(categoryDetail, {
        where: {
          id: categoryExistsById.id,
        },
      });
      if (!categoryDetails || categoryDetails[0] === 0) {
        res.status(400);
        throw new Error("Something went wrong! Category could not be updated.");
      }
    }

    return res.status(200).json({ message: "Category updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong during updation: " : ""
      }${error.message}`
    );
  }
});

// @desc Get parent category data
// @route GET /api/vat/main
// @access Private
const getMainCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all Categorys
    const categorys = await VAT.findAll({
      where: {
        parent_category: {
          [Op.eq]: null,
        },
      },
      include: {
        model: Users,
        as: "user_added_categorys",
        attributes: ["first_name", "last_name"],
      },
      attributes: ["id", "name", "active"],
      order: [["createdAt", "DESC"]],
    });
    if (!categorys) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      categorys,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching categories: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get parent category data
// @route GET /api/vat/sub
// @access Private
const getSubCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all Categorys
    const categorys = await VAT.findAll({
      where: {
        parent_category: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Categorys,
          as: "parent_categorys",
          attributes: ["name"],
        },
        {
          model: Users,
          as: "user_added_categorys",
          attributes: ["first_name", "last_name"],
        },
      ],
      attributes: ["id", "name", "active"],
      order: [["createdAt", "DESC"]],
    });
    if (!categorys) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      categorys,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching categories: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get category data
// @route GET /api/vat/active/main
// @access Private
const getActiveMainCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active category
    const categorys = await VAT.findAll({
      where: {
        [Op.and]: [
          {
            parent_category: {
              [Op.eq]: null,
            },
          },
          { active: true },
        ],
      },
      include: {
        model: Users,
        as: "user_added_categorys",
        attributes: ["first_name", "last_name"],
      },
      attributes: ["id", "name", "active"],
      order: [["createdAt", "DESC"]],
    });
    if (!categorys) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      categorys,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching active categories: "
          : ""
      }${error.message}`
    );
  }
});
// @desc Get category data
// @route GET /api/vat/active/sub
// @access Private
const getActiveSubCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active category
    const categorys = await VAT.findAll({
      where: {
        [Op.and]: [
          {
            parent_category: {
              [Op.ne]: null,
            },
          },
          { active: true },
        ],
      },
      include: [
        {
          model: Categorys,
          as: "parent_categorys",
          attributes: ["name"],
        },
        {
          model: Users,
          as: "user_added_categorys",
          attributes: ["first_name", "last_name"],
        },
      ],
      attributes: ["id", "name", "active"],
      order: [["createdAt", "DESC"]],
    });
    if (!categorys) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      categorys,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching active categories: "
          : ""
      }${error.message}`
    );
  }
});
// @desc Get category data
// @route GET /api/vat/active/all
// @access Private
const getActiveAllCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active category
    const categorys = await VAT.findAll({
      where: { active: true },
      include: {
        model: Categorys,
        as: "parent_categorys",
        attributes: ["name"],
      },
      attributes: ["id", "name", "active"],
      order: [["createdAt", "DESC"]],
    });
    if (!categorys) {
      res.status(400);
      throw new Error("No market-place found");
    }
    res.status(200).json({
      categorys,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching active categories: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get category data by ID
// @route GET /api/vat/:id
// @access Private
const getCategoryById = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_vat_and_referralfee) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    //find only one category with added by, updated by, and parent category
    const category = await VAT.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Categorys,
          as: "parent_categorys",
          attributes: ["id", "name"],
          include: [
            {
              model: Users,
              as: "user_added_categorys",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
        {
          model: Categorys,
          as: "child_categories",
          attributes: ["id", "name"],
          include: [
            {
              model: Users,
              as: "user_added_categorys",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
        {
          model: Users,
          as: "user_added_categorys",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Users,
          as: "user_updated_categorys",
          attributes: ["first_name", "last_name"],
        },
      ],
      attributes: {
        exclude: ["added_by", "updated_by"],
      },
    });
    if (!category) {
      res.status(400);
      throw new Error("Invalid category Id");
    }
    res.status(200).json({
      category,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching category data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createVatAndReferralFee,
  updateCategory,
  disableMarketPlace,
  getMainCategorys,
  getCategoryById,
  getActiveMainCategorys,
  getSubCategorys,
  getActiveSubCategorys,
  getActiveAllCategorys,
};
