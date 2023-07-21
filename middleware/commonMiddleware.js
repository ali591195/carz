const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");
const {
  PermissionSettings,
  validatePermissionSettings,
} = require("../models/permissionSettings");
const { Op } = require("sequelize");
const {
  validateUserAssignedStore,
  UserAssignedStores,
} = require("../models/userAssignedStores");
const { HuntingStores } = require("../models/huntingStores");
const {
  validateShippingCharges,
  ShippingCharges,
} = require("../models/shippingCharges");
const { validateReferralFee, ReferralFees } = require("../models/referralFee");
const { validateVAT, VAT } = require("../models/vat");
const { Marketplaces } = require("../models/marketplaces");
const { Categorys } = require("../models/categories");
const { VatReferralJunctions } = require("../models/vatReferralJunction");
const { validationResult } = require("express-validator");
// generate token after login
const generateToken = (user, permissions) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "120h",
    }
  );
};

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build the resulting errors however we want! String, object, whatever - it works!
  return `${msg}`;
};

const expressValidatorError = (req) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    console.log(result.array()[0]);
    throw new Error(result.array());
  }
};

// create user
const userCreation = (userDetail, t) => {
  return Users.create(userDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// update user
const userUpdateion = (userDetail, userId, t) => {
  return Users.update(
    userDetail,
    {
      where: {
        id: userId,
      },
    },
    {
      transaction: t,
    }
  )
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

//   create persmission settings
const permissionCreation = (permissions, userId, t) => {
  //get permission values from body
  const permissionDetails = permissions;
  permissionDetails.user_id = userId ? userId : null;

  //validate permissionSettings
  if (permissionDetails) {
    const { error } = validatePermissionSettings(permissionDetails);
    if (error) {
      throw new Error(error);
    }
  }

  return PermissionSettings.create(permissionDetails, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

//   update persmission settings
const permissionUpdation = (permissions, userId, t) => {
  //get permission values from body
  const permissionDetails = permissions;
  permissionDetails.user_id = userId ? userId : null;

  //validate permissionSettings
  if (permissionDetails) {
    const { error } = validatePermissionSettings(permissionDetails);
    if (error) {
      throw new Error(error);
    }
  }

  return PermissionSettings.update(
    permissionDetails,
    {
      where: {
        user_id: userId,
      },
    },
    {
      transaction: t,
    }
  )
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// assign store a user
const assignStoreMiddelware = async (
  user_id,
  store_id,
  added_by,
  check_user,
  t
) => {
  const storeDetail = new Object();
  storeDetail.assigned_store = store_id;
  storeDetail.assigned_user = user_id;
  storeDetail.added_by = added_by;

  //validate storeDetail
  if (storeDetail) {
    const { error } = validateUserAssignedStore(storeDetail);
    if (error) {
      throw new Error(error);
    }
  }

  //check if user exist or assigned to store
  if (check_user) {
    const userExists = await Users.findOne({
      where: {
        [Op.and]: [
          {
            id: storeDetail.assigned_user,
          },
          { active: true },
        ],
      },
      include: {
        model: UserAssignedStores,
        as: "assigned_store_to_user",
      },
    });
    if (!userExists || userExists.assigned_store_to_user) {
      throw new Error("Invalid user ID, or is already assigned to a store");
    }
  }

  //check if store exist
  const storeExists = await HuntingStores.findOne({
    where: {
      [Op.and]: [
        {
          id: storeDetail.assigned_store,
        },
        { active: true },
      ],
    },
  });
  if (!storeExists) {
    throw new Error("Invalid store ID");
  }

  //create assign store
  return UserAssignedStores.create(storeDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create marketplace and category junction
const createVatReferralJunction = async (data, t) => {
  //check if marketplace exists or not
  const marketplaceExists = await Marketplaces.findOne({
    where: {
      [Op.and]: [
        {
          id: data.marketplace_id,
        },

        { active: true },
      ],
    },
  });
  if (!marketplaceExists) {
    throw new Error("Invalid market-place ID!");
  }

  //check if category exists or not
  const categoryExists = await Categorys.findOne({
    where: {
      [Op.and]: [
        {
          id: data.category_id,
        },

        { active: true },
      ],
    },
    include: {
      model: Categorys,
      as: "child_categories",
      attributes: ["id"],
    },
  });
  if (!categoryExists) {
    throw new Error("Invalid category ID!");
  }

  return VatReferralJunctions.create(data, {
    transaction: t,
  })
    .then((result) => {
      return { result: result, category: categoryExists };
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create marketplace and category junction in bulk
const createVatReferralJunctionBulk = async (
  childCategories,
  marketPlaceId,
  minReferralFee,
  userId,
  t
) => {
  const junctionDetails = [];
  childCategories.map((childCat) => {
    const data = new Object();
    data.category_id = childCat.id;
    data.marketplace_id = marketPlaceId;
    data.min_referral_fee = minReferralFee;
    data.added_by = userId;

    junctionDetails.push(data);
  });

  return VatReferralJunctions.bulkCreate(junctionDetails, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create vat
const createVat = (vatValue, marketplaceCategoryId, userId, t) => {
  const vatDetails = new Object();
  vatDetails.value = vatValue;
  vatDetails.marketplace_category_junction_id = marketplaceCategoryId;
  vatDetails.added_by = userId;

  //validate vatDetails
  if (vatDetails) {
    const { error } = validateVAT(vatDetails);
    if (error) {
      throw new Error(error);
    }
  }
  return VAT.create(vatDetails, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create vat
const createReferralFee = (referralFee, marketplaceCategoryId, userId, t) => {
  const referralFeeDetail = referralFee;
  referralFeeDetail.map((rf, i) => {
    rf.index = i;
    rf.marketplace_category_junction_id = marketplaceCategoryId;
    rf.added_by = userId;
    rf.lessThan = rf.lessThan === "" ? null : rf.lessThan;
    rf.greaterThan = rf.greaterThan === "" ? null : rf.greaterThan;
    rf.compare = rf.compare === "" ? null : rf.compare;
  });
  //validate referral fee
  if (referralFeeDetail) {
    referralFeeDetail.map((rf) => {
      const { error } = validateReferralFee(rf);
      if (error) {
        throw new Error(error.details[0].message);
      }
    });
  }

  return ReferralFees.bulkCreate(referralFeeDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create marketplace and category junction in bulk
const createReferralFeeBulk = async (
  referralFee,
  marketplaceCategories,
  userId,
  t
) => {
  const referralFeeDetails = [];
  marketplaceCategories.map((marketplaceCat) => {
    referralFee.map((rf, i) => {
      const data = new Object();
      data.index = i;
      data.marketplace_category_junction_id = marketplaceCat.id;
      data.added_by = userId;
      data.lessThan = rf.lessThan === "" ? null : rf.lessThan;
      data.greaterThan = rf.greaterThan === "" ? null : rf.greaterThan;
      data.compare = rf.compare === "" ? null : rf.compare;
      referralFeeDetails.push(data);
    });
  });

  //validate referral fee
  if (referralFeeDetails) {
    referralFeeDetails.map((rf) => {
      const { error } = validateReferralFee(rf);
      if (error) {
        throw new Error(error.details[0].message);
      }
    });
  }

  return ReferralFees.bulkCreate(referralFeeDetails, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// create shipping charges
const shippingChargesCreation = (shippingCharges, storeId, userId, t) => {
  const chargesDetail = shippingCharges;
  chargesDetail.map((c, i) => {
    c.index = i;
    c.store_id = storeId;
    c.added_by = userId;
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

  return ShippingCharges.bulkCreate(chargesDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const destoryStoreShippingCharges = async (storeId) => {
  //check if store assignment exist
  const storeExist = await HuntingStores.findOne({
    where: {
      [Op.and]: [
        {
          id: storeId,
        },
        { active: true },
      ],
    },
    include: {
      model: ShippingCharges,
      as: "store_shipping_charges",
    },
  });
  if (!storeExist || storeExist.store_shipping_charges.length === 0) {
    throw new Error(
      "The store ID you entered does not exist, or it has no shipping charges yet."
    );
  }

  //destory shipping charges
  return ShippingCharges.destroy({
    where: {
      store_id: storeExist.id,
    },
  })
    .then((result) => {
      return {
        result: result,
        added_by: storeExist.store_shipping_charges[0].added_by,
      };
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = {
  generateToken,
  expressValidatorError,
  userCreation,
  permissionCreation,
  assignStoreMiddelware,
  userUpdateion,
  permissionUpdation,
  shippingChargesCreation,
  destoryStoreShippingCharges,
  createVat,
  createVatReferralJunction,
  createVatReferralJunctionBulk,
  createReferralFee,
  createReferralFeeBulk,
};
