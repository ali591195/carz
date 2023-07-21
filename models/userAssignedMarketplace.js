const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const UserAssignedMarketplace = sequelize.define(
  "user_assigned_marketplace",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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
    assigned_user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "users",
        key: "id",
      },
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
    tableName: "user_assigned_marketplace",
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
        name: "user_assigned_marketplace_id_forign",
        using: "BTREE",
        fields: [{ name: "marketplace_id" }],
      },
      {
        name: "marketplace_assigned_to_user_forign_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "assigned_user_id" }],
      },
      {
        name: "user_assigned_marketplace_by",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "user_assigned_marketplace_update_by",
        using: "BTREE",
        fields: [{ name: "updated_by" }],
      },
    ],
  }
);
function validateUserAssignedMarketplace(userAssignedMarketplace) {
  const schema = Joi.object({
    marketplace_id: Joi.string().guid().required(),
    assigned_user_id: Joi.string().guid().required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(userAssignedMarketplace);
}

UserAssignedMarketplace.beforeCreate(
  (userAssignedMarketplace) => (userAssignedMarketplace.id = Sequelize.UUIDV4)
);
exports.UserAssignedMarketplace = UserAssignedMarketplace;
exports.validate = validateUserAssignedMarketplace;
