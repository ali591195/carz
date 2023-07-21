const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const UserAssignedStores = sequelize.define(
  "user_assigned_stores",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    assigned_store: {
      //assigned store
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "hunting_stores",
        key: "id",
      },
    },
    assigned_user: {
      //store assigned to specific user
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "users",
        key: "id",
      },
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
  },
  {
    sequelize,
    tableName: "user_assigned_stores",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "user_assigned_stores_assigned_store_forign",
        using: "BTREE",
        fields: [{ name: "assigned_store" }],
      },
      {
        name: "user_assigned_stores_assigned_user_forign_unique",
        using: "BTREE",
        unique: true,
        fields: [{ name: "assigned_user" }],
      },
      {
        name: "user_assigned_stores_added_by_forign",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "user_assigned_stores_updated_by_forign",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
    ],
  }
);

function validateUserAssignedStores(userAssignedStores) {
  const schema = Joi.object({
    assigned_store: Joi.string().guid().required(),
    assigned_user: Joi.string().guid().required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(userAssignedStores);
}

UserAssignedStores.beforeCreate(
  (userAssignedStores) => (userAssignedStores.id = Sequelize.UUIDV4)
);
exports.UserAssignedStores = UserAssignedStores;
exports.validateUserAssignedStore = validateUserAssignedStores;
