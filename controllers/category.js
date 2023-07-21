const asyncHandler = require("express-async-handler");
const { Categorys, validateCategory } = require("../models/categories");
const { validationResult } = require("express-validator");
const { Users } = require("../models/users");
const { Op } = require("sequelize");

// @desc Create new category
// @route POST /api/category
// @access Private
const createCategory = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_category) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  const categoryDetails = req.body;
  categoryDetails.added_by = req.result.id;

  //validate categoryDetails
  if (categoryDetails) {
    const { error } = validateCategory(categoryDetails);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    // check if category exist or not
    const categoryExists = await Categorys.findOne({
      where: {
        [Op.and]: [
          {
            parent_category: categoryDetails.parent_category,
          },
          {
            name: categoryDetails.name,
          },
        ],
      },
    });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists with same name");
    }
    //if there is a parent category then check if it exists or not
    if (categoryDetails.parent_category) {
      const parentExists = await Categorys.findOne({
        where: {
          [Op.and]: [
            {
              id: categoryDetails.parent_category,
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
        throw new Error("Invalid main-category ID!");
      }
    }

    //create category
    const category = await Categorys.create(categoryDetails);
    if (!category) {
      res.status(400);
      throw new Error("Category could not be created.");
    }

    return res.status(200).json({ message: "Category created successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Update new market-place
// @route POST /api/category/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_category) {
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
    const { error } = validateCategory(categoryDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    //check if market-place exist
    const categoryExistsById = await Categorys.findOne({
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
        const categoryExists = await Categorys.findOne({
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
          const parentExists = await Categorys.findOne({
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
    const categoryDetails = await Categorys.update(categoryDetail, {
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
// @route POST /api/category/disable/:id
// @access Private
const disableCategory = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_category) {
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
    const categoryExistsById = await Categorys.findOne({
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

      const childCategoryDetails = await Categorys.update(categoryDetail, {
        where: {
          id: [childCategory, categoryExistsById.id],
        },
      });
      if (!childCategoryDetails || childCategoryDetails[0] === 0) {
        res.status(400);
        throw new Error("Something went wrong! Category could not be updated.");
      }
    } else {
      const categoryDetails = await Categorys.update(categoryDetail, {
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
// @route GET /api/category/main
// @access Private
const getMainCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_category) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all Categorys
    const categorys = await Categorys.findAll({
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
// @route GET /api/category/sub
// @access Private
const getSubCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_category) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all Categorys
    const categorys = await Categorys.findAll({
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
// @route GET /api/category/active/main
// @access Private
const getActiveMainCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_category) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active category
    const categorys = await Categorys.findAll({
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
// @route GET /api/category/active/sub
// @access Private
const getActiveSubCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_category) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active category
    const categorys = await Categorys.findAll({
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
// @route GET /api/category/active/all
// @access Private
const getActiveAllCategorys = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_category) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all  active category
    const categorys = await Categorys.findAll({
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
// @route GET /api/category/:id
// @access Private
const getCategoryById = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_category) {
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
    const category = await Categorys.findOne({
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
  createCategory,
  updateCategory,
  disableCategory,
  getMainCategorys,
  getCategoryById,
  getActiveMainCategorys,
  getSubCategorys,
  getActiveSubCategorys,
  getActiveAllCategorys,
};
