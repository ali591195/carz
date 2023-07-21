const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const HuntingStores = sequelize.define(
  "hunting_stores",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      required: true,
      unique: "hunting_store_name_unique",
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
      unique: "hunting_store_link_unique",
    },
    discount: {
      //%
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      required: true,
    },
    added_by: {
      //store added by which person
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "hunting_stores",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "hunting_stores_name_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "name" }],
      },
      {
        name: "hunting_store_link_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "link" }],
      },
      {
        name: "hunting_stores_added_by_forign",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "hunting_stores_updated_by_forign",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
      {
        name: "hunting_store_active",
        using: "BTREE",
        fields: [{ name: "active" }],
      },
    ],
  }
);

function validateHuntingStores(huntingStores) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    link: Joi.string().required(),
    discount: Joi.number().required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(huntingStores);
}

HuntingStores.beforeCreate(
  (huntingStores) => (huntingStores.id = Sequelize.UUIDV4)
);
exports.HuntingStores = HuntingStores;
exports.validateHuntingStores = validateHuntingStores;
