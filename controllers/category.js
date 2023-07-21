const asyncHandler = require("express-async-handler");
const { Categories, validateCategory } = require("../models/categories");
const { validationResult } = require("express-validator");

// @desc Create new category
// @route POST /api/category
// @access Private
const createCategory = asyncHandler(async (req, res) => {
  const categoryDetails = req.body;

  //validate categoryDetails
  if (categoryDetails) {
    const { error } = validateCategory(categoryDetails);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    // check if category exist or not
    const categoryExists = await Categories.findOne({
      where: {
        name: categoryDetails.name,
      },
    });

    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists with same name");
    }

    //create category
    const category = await Categories.create(categoryDetails);
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

// @desc Updat category
// @route PUT /api/category/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const categoryDetail = req.body;

  //validate categoryDetail
  if (categoryDetail) {
    const { error } = validateCategory(categoryDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  categoryDetail.updated_by = req.result.id;

  try {
    //check if market-place exist
    const categoryExistsById = await Categories.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryExistsById) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //update category
    const categoryDetails = await Categories.update(categoryDetail, {
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

// @desc Delete category
// @route DELETE /api/category/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check if market-place exist
    const categoryExistsById = await Categories.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryExistsById) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //update category
    const categoryDetails = await Categories.destroy({
      where: {
        id: categoryExistsById.id,
      },
    });
    if (!categoryDetails) {
      res.status(400);
      throw new Error("Something went wrong! Category could not be deleted.");
    }

    return res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category deletion: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get all category
// @route GET /api/category/
const getCategories = asyncHandler(async (req, res) => {
  try {
    //get all categories
    const categories = await Categories.findAll({
      attributes: ["id", "name"],
    });

    return res.status(200).send(categories);
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category deletion: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
