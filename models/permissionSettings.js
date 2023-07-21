const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const PermissionSettings = sequelize.define(
  "permission_settings",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    dashboard: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    order: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    order_processing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    inventory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hunting_list: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hunting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    view_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    create_and_edit_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    commenting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    approval_process: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    view_marketplace: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    create_and_edit_marketplace: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    view_category: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    create_and_edit_category: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    view_vat_and_referralfee: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    create_and_edit_vat_and_referralfee: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    view_store: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    create_and_edit_store: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    change_store: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "permission_settings",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "permission_settings_user_id_forign_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "user_id" }],
      },
    ],
  }
);

function validatePermissionSettings(permissionSettings) {
  const schema = Joi.object({
    user_id: Joi.string().guid().required(),
    dashboard: Joi.boolean(),
    order: Joi.boolean(),
    order_processing: Joi.boolean(),
    inventory: Joi.boolean(),
    hunting_list: Joi.boolean(),
    hunting: Joi.boolean(),
    view_user: Joi.boolean(),
    create_and_edit_user: Joi.boolean(),
    commenting: Joi.boolean(),
    approval_process: Joi.boolean(),
    view_store: Joi.boolean(),
    create_and_edit_store: Joi.boolean(),
    view_marketplace: Joi.boolean(),
    create_and_edit_marketplace: Joi.boolean(),
    view_vat_and_referralfee: Joi.boolean(),
    create_and_edit_vat_and_referralfee: Joi.boolean(),
    view_category: Joi.boolean(),
    create_and_edit_category: Joi.boolean(),
    change_store: Joi.boolean(),
  });
  return schema.validate(permissionSettings);
}
PermissionSettings.beforeCreate(
  (permissionSetting) => (permissionSetting.id = Sequelize.UUIDV4)
);

exports.PermissionSettings = PermissionSettings;
exports.validatePermissionSettings = validatePermissionSettings;
