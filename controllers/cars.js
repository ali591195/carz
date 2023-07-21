const asyncHandler = require("express-async-handler");
const { Cars, validateCars } = require("../models/cars");
const { validationResult } = require("express-validator");
const { Categories } = require("../models/categories");

// @desc Create new cars
// @route POST /api/cars
// @access Private
const createCar = asyncHandler(async (req, res) => {
  const carDetails = req.body;

  //validate carDetails
  if (carDetails) {
    const { error } = validateCars(carDetails);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    // check if car's category exist or not
    const categoryExist = await Categories.findOne({
      where: {
        id: carDetails.category_id,
      },
    });

    if (!categoryExist) {
      res.status(400);
      throw new Error("Category Id does not exist");
    }

    //create category
    const car = await Cars.create(carDetails);
    if (!car) {
      res.status(400);
      throw new Error("Car could not be created.");
    }

    return res.status(200).json({ message: "Car created successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in car creation: " : ""
      }${error.message}`
    );
  }
});

// @desc Updat cars
// @route PUT /api/cars/:id
// @access Private
const updateCar = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const carDetail = req.body;

  //validate carDetail
  if (carDetail) {
    const { error } = validateCars(carDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  carDetail.updated_by = req.result.id;

  try {
    //check if market-place exist
    const carExistById = await Cars.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!carExistById) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    const categoryExist = await Categories.findOne({
      where: {
        id: carDetail.category_id,
      },
    });

    if (!categoryExist) {
      res.status(400);
      throw new Error("Category Id does not exist");
    }

    //update car
    const carDetails = await Cars.update(carDetail, {
      where: {
        id: carExistById.id,
      },
    });
    if (!carDetails || carDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Car could not be updated.");
    }

    return res.status(200).json({ message: "Car updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in car updation: " : ""
      }${error.message}`
    );
  }
});

// @desc Delete cars
// @route DELETE /api/cars/:id
// @access Private
const deleteCar = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check if market-place exist
    const carExistById = await Cars.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!carExistById) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //update category
    const carDetails = await Cars.destroy({
      where: {
        id: carExistById.id,
      },
    });
    if (!carDetails) {
      res.status(400);
      throw new Error("Something went wrong! Cars could not be deleted.");
    }

    return res.status(200).json({ message: "Cars deleted successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in car deletion: " : ""
      }${error.message}`
    );
  }
});

// @desc Get all cars
// @route GET /api/cars/
const getCars = asyncHandler(async (req, res) => {
  try {
    //get all categories
    const cars = await Cars.findAll({
      include: {
        model: Categories,
        as: "car_category",
        attributes: ["id", "name"],
      },
      attributes: ["id", "name"],
    });

    return res.status(200).send(cars);
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in getting cars: " : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createCar,
  updateCar,
  deleteCar,
  getCars,
};
