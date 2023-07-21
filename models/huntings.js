const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const Huntings = sequelize.define(
  "huntings",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    asin: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
      unique: "huntings_asin_unique",
    },

    source_sku: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
      unique: "huntings_source_sku_unique",
    },
    bsr: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
    },
    amazon_link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
    },
    source_link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
    },
    variant_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "MAIN",
      required: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
    },
    amazon_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    source_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    after_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    refer_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    vat: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    profit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      required: true,
    },
    margin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      required: true,
    },
    roi: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      required: true,
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "GBP",
    },
    units: {
      type: DataTypes.INTEGER,
      allowNull: false,
      required: true,
    },
    status: {
      type: Sequelize.ENUM("Pending", "Rejected", "Live"),
      allowNull: false,
      defaultValue: "Pending",
    },
    processed_by: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "huntings",
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
        name: "huntings_asin_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "asin" }],
      },
      {
        name: "huntings_source_sku_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "source_sku" }],
      },
      {
        name: "huntings_source_status",
        using: "BTREE",
        fields: [{ name: "status" }],
      },
      {
        name: "huntings_source_processed_by_forign",
        using: "BTREE",
        fields: [{ name: "processed_by" }],
      },
      {
        name: "huntings_source_created_by_forign",
        using: "BTREE",
        fields: [{ name: "created_by" }],
      },
    ],
  }
);
function validateHuntings(huntings) {
  const schema = Joi.object({
    asin: Joi.string().required(),
    source_sku: Joi.string().required(),
    bsr: Joi.string().required(),
    amazon_link: Joi.string().required(),
    source_link: Joi.string().required(),
    variant_type: Joi.string().required(),
    title: Joi.string().required(),
    units: Joi.number().required(),
    amazon_price: Joi.number().required(),
    source_price: Joi.number().required(),
    currency: Joi.string().required(),
    after_discount: Joi.number().required(),
    delivery_charges: Joi.number().required(),
    refer_fee: Joi.number().required(),
    vat: Joi.number().required(),
    profit: Joi.number().required(),
    margin: Joi.number().required(),
    roi: Joi.number().required(),
    status: Joi.string().valid("Pending", "Rejected", "Live"),
    processed_by: Joi.string().guid(),
    processed_at: Joi.date(),
    created_by: Joi.string().guid(),
  });
  return schema.validate(huntings);
}
Huntings.beforeCreate((huntings) => (huntings.id = Sequelize.UUIDV4));
exports.Huntings = Huntings;
exports.validate = validateHuntings;
