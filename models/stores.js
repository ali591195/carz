const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize'),
  sequelize = require('../config/database');
const Joi = require('joi');
const Stores = sequelize.define(
  'stores',
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    api_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lwa_client_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lwa_client_secret: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lwa_refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    aws_access_key_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    aws_secret_access_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_arn: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_order_fetch_datetime: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'stores',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
    ],
  }
);
function validateStores(stores) {
  // const schema = Joi.object({
  //   firstName: Joi.string().min(3).max(50),
  //   lastName: Joi.string().min(3).max(50),
  //   user_name: Joi.string().min(3).max(50).required(),
  //   email: Joi.string()
  //     .min(5)
  //     .max(255)
  //     .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  //   password: Joi.string()
  //     .pattern(new RegExp('^[a-zA-Z0-9@]{3,255}$'))
  //     .min(5)
  //     .max(255),
  //   profile_image: Joi.string(),
  //   repeatPassword: Joi.ref('password'),
  //   is_super_admin: Joi.boolean(),
  //   email_verified_at: Joi.date(),
  //   added_by: Joi.string().guid(),
  //   is_active: Joi.boolean(),
  //   updated_by: Joi.string().guid(),
  // });
  // return schema.validate(stores);
}

// Stores.beforeCreate((stores) => (stores.id = Sequelize.UUIDV4));
exports.Stores = Stores;
exports.validate = validateStores;
