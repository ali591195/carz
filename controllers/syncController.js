const { Cars } = require("../models/cars");
const { HuntingStores } = require("../models/huntingStores");
const { Marketplaces } = require("../models/marketplaces"),
  { Orders } = require("../models/orders"),
  { Stores } = require("../models/stores"),
  { Users } = require("../models/users"),
  { Huntings } = require("../models/huntings"),
  { PermissionSettings } = require("../models/permissionSettings"),
  { UserAssignedMarketplace } = require("../models/userAssignedMarketplace"),
  { VAT } = require("../models/vat"),
  { ReferralFees } = require("../models/referralFee"),
  { VatReferralJunctions } = require("../models/vatReferralJunction"),
  { Categorys, Categories } = require("../models/categories"),
  { UserAssignedStores } = require("../models/userAssignedStores"),
  { Comments } = require("../models/comments");
const { ShippingCharges } = require("../models/shippingCharges");

const syncDatabase = async () => {
  await Users.sync({ alter: true });
  await Categories.sync({ alter: true });
  await Cars.sync({ alter: true });
};
module.exports = {
  syncDatabase,
};
