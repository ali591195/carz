const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const VatReferralJunctions = sequelize.define(
  "vat_referral_junctions",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    category_id: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "categorys",
        key: "id",
      },
    },
    marketplace_id: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "marketplaces",
        key: "id",
      },
    },
    min_referral_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    added_by: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    updated_by: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "vat_referral_junctions",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "vat_category_id",
        using: "BTREE",
        fields: [{ name: "category_id" }],
      },
      {
        name: "vat_marketplace_id",
        using: "BTREE",
        fields: [{ name: "marketplace_id" }],
      },
      {
        name: "vat_referral_junctions_added_by_forign",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "vat_referral_junctions_updated_by_forign",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
    ],
  }
);

function validateVatReferralJunctions(vatReferralJunctions) {
  const schema = Joi.object({
    min_referral_fee: Joi.number().required(),
    category_id: Joi.string().guid().required(),
    marketplace_id: Joi.string().guid().required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(vatReferralJunctions);
}

VatReferralJunctions.beforeCreate(
  (vatReferralJunctions) => (vatReferralJunctions.id = Sequelize.UUIDV4)
);
exports.VatReferralJunctions = VatReferralJunctions;
exports.validateVatReferralJunctions = validateVatReferralJunctions;
