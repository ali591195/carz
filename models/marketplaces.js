const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const Marketplaces = sequelize.define(
  "marketplaces",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    marketplace_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
      unique: "marketplaces_id_unique",
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
      unique: "marketplaces_country_unique",
    },
    country_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      required: true,
      unique: "marketplaces_country_code_unique",
    },
    currency: {
      type: DataTypes.STRING(5),
      allowNull: false,
      required: true,
    },
    symbol: {
      type: DataTypes.STRING(5),
      allowNull: false,
      required: true,
    },
    added_by: {
      type: Sequelize.UUID,
      allowNull: true,
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "marketplaces",
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
        name: "marketplaces_id_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "marketplace_id" }],
      },
      {
        name: "marketplaces_country_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "country" }],
      },
      {
        name: "marketplaces_country_code_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "country_code" }],
      },
      {
        name: "marketplaces_added_by",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "marketplaces_updated_by",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
      {
        name: "marketplaces_active",
        using: "BTREE",
        fields: [{ name: "active" }],
      },
    ],
  }
);
function validateMarketplaces(marketplaces) {
  const schema = Joi.object({
    marketplace_id: Joi.string().min(10).max(50).required(),
    country: Joi.string().max(50).required(),
    country_code: Joi.string().max(5).required(),
    currency: Joi.string().max(5).required(),
    symbol: Joi.string().max(5).required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(marketplaces);
}

Marketplaces.beforeCreate(
  (marketplaces) => (marketplaces.id = Sequelize.UUIDV4)
);
exports.Marketplaces = Marketplaces;
exports.validateMarketplaces = validateMarketplaces;
