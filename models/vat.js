const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const VAT = sequelize.define(
  "vat",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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
    value: {
      // %
      type: DataTypes.DECIMAL(5, 2),
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
    tableName: "vat",
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
        name: "vat_marketplace_category_junction_id",
        using: "BTREE",
        fields: [{ name: "marketplace_category_junction_id" }],
      },

      {
        name: "vat_added_by",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "vat_updated_by",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
    ],
  }
);
function validateVAT(vat) {
  const schema = Joi.object({
    value: Joi.number().required(),
    marketplace_category_junction_id: Joi.string().guid().required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(vat);
}

VAT.beforeCreate((vat) => (vat.id = Sequelize.UUIDV4));
exports.VAT = VAT;
exports.validateVAT = validateVAT;
