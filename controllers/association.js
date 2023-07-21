const { Cars } = require("../models/cars");
const { Marketplaces } = require("../models/marketplaces"),
  { Orders } = require("../models/orders"),
  { Users } = require("../models/users"),
  { PermissionSettings } = require("../models/permissionSettings"),
  { Huntings } = require("../models/huntings"),
  { UserAssignedMarketplace } = require("../models/userAssignedMarketplace"),
  { Categorys, Categories } = require("../models/categories"),
  { VAT } = require("../models/vat"),
  { HuntingStores } = require("../models/huntingStores"),
  { UserAssignedStores } = require("../models/userAssignedStores"),
  { Comments } = require("../models/comments");
const { ReferralFees } = require("../models/referralFee");
const { ShippingCharges } = require("../models/shippingCharges");
const { VatReferralJunctions } = require("../models/vatReferralJunction");

const association = () => {
  /*----------------------------------------------*/
  // //User to User
  // Users.belongsTo(Users, {
  //   as: "added_by_user",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(Users, {
  //   as: "user_added_by",
  //   foreignKey: "added_by",
  //   useJunctionTable: false,
  // });
  // Users.belongsTo(Users, {
  //   as: "updated_by_user",
  //   foreignKey: "updated_by",
  // });
  // Users.hasMany(Users, {
  //   as: "user_updated_by",
  //   foreignKey: "updated_by",
  //   useJunctionTable: false,
  // });

  /*----------------------------------------------*/
  //Cars to Categories
  Categories.hasMany(Cars, {
    as: "category_has_car",
    foreignKey: "category_id",
  });
  Cars.belongsTo(Categories, {
    as: "car_category",
    foreignKey: "category_id",
  });

  // /*----------------------------------------------*/
  // //PermissionSettings to Users
  // Users.hasOne(PermissionSettings, {
  //   as: "permission_settings",
  //   foreignKey: "user_id",
  // });
  // PermissionSettings.belongsTo(Users, {
  //   as: "user_permission",
  //   foreignKey: "user_id",
  // });

  // /*----------------------------------------------*/
  // //Huntings to Users
  // Users.hasMany(Huntings, {
  //   as: "hunting_created_by",
  //   foreignKey: "created_by",
  // });
  // Huntings.belongsTo(Users, {
  //   as: "user_created_hunting",
  //   foreignKey: "created_by",
  // });
  // Users.hasMany(Huntings, {
  //   as: "hunting_processed_by",
  //   foreignKey: "processed_by",
  // });
  // Huntings.belongsTo(Users, {
  //   as: "user_processed_hunting",
  //   foreignKey: "processed_by",
  // });

  // /*----------------------------------------------*/
  // //HuntingStores to Users
  // Users.hasMany(HuntingStores, {
  //   as: "hunting_store_added_by",
  //   foreignKey: "added_by",
  // });
  // HuntingStores.belongsTo(Users, {
  //   as: "user_added_hunting_store",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(HuntingStores, {
  //   as: "hunting_store_updated_by",
  //   foreignKey: "updated_by",
  // });
  // HuntingStores.belongsTo(Users, {
  //   as: "user_updated_hunting_store",
  //   foreignKey: "updated_by",
  // });

  // /*----------------------------------------------*/
  // //ShippingCharges to HuntingStores
  // HuntingStores.hasMany(ShippingCharges, {
  //   as: "store_shipping_charges",
  //   foreignKey: "store_id",
  // });
  // ShippingCharges.belongsTo(HuntingStores, {
  //   as: "shipping_charges_store_id",
  //   foreignKey: "store_id",
  // });
  // //ShippingCharges to Users
  // Users.hasMany(ShippingCharges, {
  //   as: "shipping_charges_added_by",
  //   foreignKey: "added_by",
  // });
  // ShippingCharges.belongsTo(Users, {
  //   as: "user_added_shipping_charges",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(ShippingCharges, {
  //   as: "shipping_charges_updated_by",
  //   foreignKey: "updated_by",
  // });
  // ShippingCharges.belongsTo(Users, {
  //   as: "user_updated_shipping_charges",
  //   foreignKey: "updated_by",
  // });

  // /*----------------------------------------------*/
  // //UserAssignedStores to HuntingStores
  // HuntingStores.hasMany(UserAssignedStores, {
  //   as: "assigned_store",
  //   foreignKey: "assigned_store",
  // });
  // UserAssignedStores.belongsTo(HuntingStores, {
  //   as: "hunting_store_assigned",
  //   foreignKey: "assigned_store",
  // });
  // //UserAssignedStores to Users
  // Users.hasOne(UserAssignedStores, {
  //   as: "assigned_store_to_user",
  //   foreignKey: "assigned_user",
  // });
  // UserAssignedStores.belongsTo(Users, {
  //   as: "store_assigned_to_user",
  //   foreignKey: "assigned_user",
  // });
  // Users.hasMany(UserAssignedStores, {
  //   as: "user_assigned_store_added_by",
  //   foreignKey: "added_by",
  // });
  // UserAssignedStores.belongsTo(Users, {
  //   as: "user_added_user_assigned_store",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(UserAssignedStores, {
  //   as: "user_assigned_store_updated_by",
  //   foreignKey: "updated_by",
  // });
  // UserAssignedStores.belongsTo(Users, {
  //   as: "user_updated_user_assigned_store",
  //   foreignKey: "updated_by",
  // });

  // /*----------------------------------------------*/
  // //Comments to Users
  // Users.hasMany(Comments, {
  //   as: "comment_added_by",
  //   foreignKey: "added_by",
  // });
  // Comments.belongsTo(Users, {
  //   as: "user_added_comment",
  //   foreignKey: "added_by",
  // });
  // //Comments to Huntings
  // Huntings.hasMany(Comments, {
  //   as: "comments_display_on",
  //   foreignKey: "display_on",
  // });
  // Comments.belongsTo(Huntings, {
  //   as: "hunting_comment",
  //   foreignKey: "display_on",
  // });

  // /*----------------------------------------------*/
  // //Marketplaces to Users
  // Users.hasMany(Marketplaces, {
  //   as: "marketplace_added_by",
  //   foreignKey: "added_by",
  // });
  // Marketplaces.belongsTo(Users, {
  //   as: "user_added_marketplace",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(Marketplaces, {
  //   as: "marketplace_updated_by",
  //   foreignKey: "updated_by",
  // });
  // Marketplaces.belongsTo(Users, {
  //   as: "user_updated_marketplace",
  //   foreignKey: "updated_by",
  // });

  // /*----------------------------------------------*/
  // //UserAssignedMarketplace to Marketplaces
  // Marketplaces.hasMany(UserAssignedMarketplace, {
  //   as: "user_assigned_marketplace_id",
  //   foreignKey: "marketplace_id",
  // });
  // UserAssignedMarketplace.belongsTo(Marketplaces, {
  //   as: "marketplace_id_assigned_to_user",
  //   foreignKey: "marketplace_id",
  // });
  // //UserAssignedMarketplace to Users
  // Users.hasOne(UserAssignedMarketplace, {
  //   as: "marketplace_assigned_to_user",
  //   foreignKey: "assigned_user_id",
  // });
  // UserAssignedMarketplace.belongsTo(Users, {
  //   as: "user_assigned_a_marketplace",
  //   foreignKey: "assigned_user_id",
  // });
  // Users.hasMany(UserAssignedMarketplace, {
  //   as: "user_assigned_marketplace_by",
  //   foreignKey: "added_by",
  // });
  // UserAssignedMarketplace.belongsTo(Users, {
  //   as: "marketplace_assigned_by_a_user",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(UserAssignedMarketplace, {
  //   as: "user_assigned_marketplace_update_by",
  //   foreignKey: "updated_by",
  // });
  // UserAssignedMarketplace.belongsTo(Users, {
  //   as: "marketplace_update_by_a_user",
  //   foreignKey: "updated_by",
  // });

  // /*----------------------------------------------*/
  // //Categorys to Category
  // Categorys.belongsTo(Categorys, {
  //   as: "parent_categorys",
  //   foreignKey: "parent_category",
  // });
  // Categorys.hasMany(Categorys, {
  //   as: "child_categories",
  //   foreignKey: "parent_category",
  //   useJunctionTable: false,
  // });
  // //Categorys to Users
  // Users.hasMany(Categorys, {
  //   as: "categorys_added_by",
  //   foreignKey: "added_by",
  // });
  // Categorys.belongsTo(Users, {
  //   as: "user_added_categorys",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(Categorys, {
  //   as: "categorys_updated_by",
  //   foreignKey: "updated_by",
  // });
  // Categorys.belongsTo(Users, {
  //   as: "user_updated_categorys",
  //   foreignKey: "updated_by",
  // });

  // /*----------------------------------------------*/
  // //VatReferralJuntion to Users
  // Users.hasMany(VatReferralJunctions, {
  //   as: "vat_referral_junction_added_by",
  //   foreignKey: "added_by",
  // });
  // VatReferralJunctions.belongsTo(Users, {
  //   as: "user_added_vat_referral_junction",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(VatReferralJunctions, {
  //   as: "vat_referral_junction_updated_by",
  //   foreignKey: "updated_by",
  // });
  // VatReferralJunctions.belongsTo(Users, {
  //   as: "user_updated_vat_referral_junction",
  //   foreignKey: "updated_by",
  // });
  // //VatReferralJunctions to Marketplaces
  // Marketplaces.hasMany(VatReferralJunctions, {
  //   as: "vat_referral_junction_marketplace_id",
  //   foreignKey: "marketplace_id",
  // });
  // VatReferralJunctions.belongsTo(Marketplaces, {
  //   as: "marketplace_id_for_vat_referral_junction",
  //   foreignKey: "marketplace_id",
  // });
  // //VatReferralJunctions to Categorys
  // Categorys.hasMany(VatReferralJunctions, {
  //   as: "vat_referral_junction_category_id",
  //   foreignKey: "category_id",
  // });
  // VatReferralJunctions.belongsTo(Categorys, {
  //   as: "category_id_for_vat_referral_junction",
  //   foreignKey: "category_id",
  // });

  // /*----------------------------------------------*/
  // //VAT to Users
  // Users.hasMany(VAT, {
  //   as: "vat_added_by",
  //   foreignKey: "added_by",
  // });
  // VAT.belongsTo(Users, {
  //   as: "user_added_vat",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(VAT, {
  //   as: "vat_updated_by",
  //   foreignKey: "updated_by",
  // });
  // VAT.belongsTo(Users, {
  //   as: "user_updated_vat",
  //   foreignKey: "updated_by",
  // });
  // //VAT to VatReferralJunctions
  // VatReferralJunctions.hasMany(VAT, {
  //   as: "vat_referral_junction_id",
  //   foreignKey: "marketplace_category_junction_id",
  // });
  // VAT.belongsTo(VatReferralJunctions, {
  //   as: "vat_referral_junction_id_for_vat",
  //   foreignKey: "marketplace_category_junction_id",
  // });

  // /*----------------------------------------------*/
  // //ReferralFee to VatReferralJunctions
  // VatReferralJunctions.hasMany(ReferralFees, {
  //   as: "vat_referral_junction_id_referral_fee",
  //   foreignKey: "marketplace_category_junction_id",
  // });
  // ReferralFees.belongsTo(VatReferralJunctions, {
  //   as: "referral_fee_vat_referral_junction_id",
  //   foreignKey: "marketplace_category_junction_id",
  // });
  // //ReferralFee to Users
  // Users.hasMany(ReferralFees, {
  //   as: "referral_fee_added_by",
  //   foreignKey: "added_by",
  // });
  // ReferralFees.belongsTo(Users, {
  //   as: "user_added_referral_fee",
  //   foreignKey: "added_by",
  // });
  // Users.hasMany(ReferralFees, {
  //   as: "referral_fee_updated_by",
  //   foreignKey: "updated_by",
  // });
  // ReferralFees.belongsTo(Users, {
  //   as: "user_updated_referral_fee",
  //   foreignKey: "updated_by",
  // });
};
module.exports = {
  association,
};
