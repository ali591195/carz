const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sequelize = require("../config/database");
const asyncHandler = require("express-async-handler");
const { Users, validateUser } = require("../models/users");
const { PermissionSettings } = require("../models/permissionSettings");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { HuntingStores } = require("../models/huntingStores");
const { UserAssignedStores } = require("../models/userAssignedStores");
const {
  // userCreation,
  permissionCreation,
  generateToken,
  assignStoreMiddelware,
  userUpdateion,
  permissionUpdation,
  expressValidatorError,
} = require("../middleware/commonMiddleware");
const nodemailer = require("nodemailer");

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  //validate param data
  expressValidatorError(req);

  try {
    //check user email verification
    const user = await Users.findOne({
      where: {
        [Op.and]: [{ email: req.body.email }],
      },
    });
    if (!user) {
      res.status(400);
      throw new Error("No user found!");
    }

    //check password
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      return res.status(200).json({
        token: generateToken(user),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials or user not found.");
    }
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${res.statusCode !== 400 ? "Something went wrong during login: " : ""}${
        error.message
      }`
    );
  }
});

// @desc Create new user
// @route POST /api/users
// @access Private
const createUser = asyncHandler(async (req, res) => {
  //validate param data
  expressValidatorError(req);

  const userDetail = req.body;

  //randomly generate password

  //validate userDetail
  if (userDetail) {
    const { error } = validateUser(userDetail);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  }

  try {
    //check if user exist
    const userExists = await findUser(userDetail.email);
    if (userExists) {
      res.status(400);
      throw new Error("User already exists with same email address");
    }

    // generate password
    const randomPass = generateRandomPassword(15);

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptPass = await bcrypt.hash(randomPass, salt);

    userDetail.password = encryptPass;

    //create user
    const userDetails = await userCreation(userDetail);

    if (!userDetails) {
      res.status(400);
      throw new Error("User could not be created!");
    }

    userDetail.password = randomPass;
    //now send the mail with randomly generated password
    sendEmail(userDetail);
    return res.status(200).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in user creation: " : ""
      }${error.message}`
    );
  }
});

// @desc get logedin user
// @route GET /api/users/
// @access Private
const getUser = asyncHandler(async (req, res) => {
  res.json(req.result);
});

// @desc Update new user
// @route POST /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_user) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userDetail = req.body.user;
  userDetail.updated_by = req.result.id;

  //validate userDetail
  if (userDetail) {
    const { error } = validateUser(userDetail);
    if (error) return res.status(400).send(error.details[0].message);
  }

  const t = await sequelize.transaction();
  try {
    //check if user exist
    const userExistsById = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!userExistsById) {
      res.status(400);
      throw new Error("The user ID you entered does not exist");
    } else {
      //check if user email and cnic already exist
      if (
        userExistsById.email !== userDetail.email ||
        (userDetail.CNIC && userExistsById.CNIC !== userDetail.CNIC)
      ) {
        const userExists = await Users.findOne({
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.ne]: userExistsById.id,
                },
              },
              {
                [Op.or]: [
                  { email: userDetail.email },
                  userDetail.CNIC && { CNIC: userDetail.CNIC },
                ],
              },
            ],
          },
        });
        if (userExists) {
          res.status(400);
          throw new Error(
            "User already exists with same email address or CNIC number"
          );
        }
      }
    }

    //update user
    const userDetails = await userUpdateion(userDetail, userExistsById.id, t);

    if (!userDetails || userDetails[0] === 0) {
      res.status(400);
      throw new Error(
        "User could not be updated. Rollback initiated in Users."
      );
    }
    //update PermissionSettings
    const permissions = await permissionUpdation(
      req.body.permissions,
      userExistsById.id,
      t
    );
    if (!permissions) {
      res.status(400);
      throw new Error(
        "Permission Settings could not be updated. Rollback initiated in Permission Settings."
      );
    }
    await t.commit();
    return res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    await t.rollback();
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in user updation: " : ""
      }${error.message}`
    );
  }
});

// @desc Freeze new user
// @route POST /api/users/freeze/:id
// @access Private
const freezeUser = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.create_and_edit_user) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userDetail = req.body;
  userDetail.updated_by = req.result.id;

  try {
    //check if user exist
    const userExistsById = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!userExistsById) {
      res.status(400);
      throw new Error("The user ID you entered does not exist");
    }

    //freeze user
    const userDetails = await Users.update(userDetail, {
      where: {
        id: userExistsById.id,
      },
    });
    if (!userDetails || userDetails[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! User could not be updated.");
    }

    return res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during user updation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get user data
// @route GET /api/users/all
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_user) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //get all users
    const user = await Users.findAll({
      include: {
        model: Users,
        as: "added_by_user",
        attributes: ["first_name", "last_name"],
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "active",
        "joined_at",
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!user) {
      res.status(400);
      throw new Error("No user found");
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching users: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get active user data
// @route GET /api/users/active
// @access Private
const getActiveUsers = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_user) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //get all users
    const user = await Users.findAll({
      where: { active: true },
      include: {
        model: Users,
        as: "added_by_user",
        attributes: ["first_name", "last_name"],
      },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "active",
        "joined_at",
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!user) {
      res.status(400);
      throw new Error("No user found");
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching active users: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get user data by ID
// @route GET /api/users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
  if (!req.result.permission_settings.view_user) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    //find only one user with added by, updated by, and permission settings
    const user = await Users.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Users,
          as: "added_by_user",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Users,
          as: "updated_by_user",
          attributes: ["first_name", "last_name"],
        },
        {
          model: PermissionSettings,
          as: "permission_settings",
          attributes: {
            exclude: ["user_id", "createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: UserAssignedStores,
          as: "assigned_store_to_user",
          attributes: ["id"],
          include: [
            {
              model: HuntingStores,
              as: "hunting_store_assigned",
              attributes: ["name", "link", "discount"],
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
      ],
      attributes: {
        exclude: [
          "password",
          "email_verified_at",
          "two_factor_secret",
          "deletedAt",
          "added_by",
          "updated_by",
        ],
      },
    });
    if (!user) {
      res.status(400);
      throw new Error("User don't exist");
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching user data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get active user data without store assigned to them
// @route GET /api/users/active/without_store
// @access Private
const getActiveUsersWithoutStores = asyncHandler(async (req, res) => {
  if (
    !req.result.permission_settings.create_and_edit_store ||
    !req.result.permission_settings.view_user
  ) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all users
    const users = await Users.findAll({
      where: { active: true },
      include: [
        {
          model: UserAssignedStores,
          as: "assigned_store_to_user",
        },
        {
          model: PermissionSettings,
          as: "permission_settings",
          attributes: ["hunting"],
        },
      ],
      attributes: ["id", "first_name", "last_name"],
      order: [["createdAt", "DESC"]],
    });
    if (!users) {
      res.status(400);
      throw new Error("No user found");
    }

    const filteredUsers = users.filter(
      (user) =>
        user.assigned_store_to_user === null &&
        user.permission_settings.hunting === true
    );
    res.status(200).json({
      filteredUsers,
    });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong while fetching users without store: "
          : ""
      }${error.message}`
    );
  }
});

//------------------------Helper functions--------------------------
// find user with email address
const findUser = (email) => {
  return Users.findOne({
    where: { email: email },
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create user
async function userCreation(userDetail) {
  try {
    const result = await Users.create(userDetail);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

//function to send mail with randomly generated password
const sendEmail = (recipient) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  //recipient information
  const mailOptions = {
    from: "your_email@gmail.com",
    to: recipient.email,
    subject: `Welcome to Carz`,
    text: `Hello ${recipient.full_name}, you have recently registered to our system, here is your Password: ${recipient.password}.`,
  };

  //send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

function generateRandomPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytes = crypto.randomBytes(length);
  let password = "";

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % characters.length;
    password += characters.charAt(index);
  }

  return password;
}

module.exports = {
  createUser,
  updateUser,
  freezeUser,
  loginUser,
  getAllUsers,
  getUserById,
  getActiveUsers,
  getActiveUsersWithoutStores,
  getUser,
};
