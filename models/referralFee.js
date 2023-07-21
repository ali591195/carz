const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const ReferralFees = sequelize.define(
  "referral_fee",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    index: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      require: true,
    },
    marketplace_category_junction_id: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "vat_referral_junctions",
        key: "id",
      },
    },
    lessThan: {
      // %
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      required: true,
    },
    compare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    greaterThan: {
      // %
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
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
    tableName: "referral_fee",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "referral_fee_marketplace_category_junction_id",
        using: "BTREE",
        fields: [{ name: "marketplace_category_junction_id" }],
      },
      {
        name: "referral_fee_added_by",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "referral_fee_updated_by",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
    ],
  }
);
function validateReferralFee(referral_fee) {
  const schema = Joi.object({
    index: Joi.number(),
    marketplace_category_junction_id: Joi.string().guid().required(),
    lessThan: Joi.number().required(),
    greaterThan: Joi.number().optional().allow(null),
    compare: Joi.number().optional().allow(null),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(referral_fee);
}

ReferralFees.beforeCreate(
  (referral_fee) => (referral_fee.id = Sequelize.UUIDV4)
);
exports.ReferralFees = ReferralFees;
exports.validateReferralFee = validateReferralFee;
