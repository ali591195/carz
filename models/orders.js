const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize'),
  sequelize = require('../config/database');
const Joi = require('joi');
const Orders = sequelize.define(
  'orders',
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
      references: {
        model: 'marketplaces',
        key: 'id',
      },
    },
    amazon_order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    seller_order_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fulfillment_channel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sales_channel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ship_service_level: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    order_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refer_fee: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    purchase_price: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profit: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'GBP',
    },
    order_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    items_shipped: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    items_unshipped: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fulfillment_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    shipment_service_level_category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    earliest_ship_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Latest_Ship_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    earliest_delivery_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latest_delivery_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    purchase_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total_comments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    placed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_update_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    processed_by: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
      {
        name: 'orders_marketplace_id_foreign',
        using: 'BTREE',
        fields: [{ name: 'marketplace_id' }],
      },
      {
        name: 'orders_processed_by_foreign',
        using: 'BTREE',
        fields: [{ name: 'processed_by' }],
      },
    ],
  }
);
function validateOrders(orders) {
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
  // return schema.validate(orders);
}

Orders.beforeCreate((orders) => (orders.id = Sequelize.UUIDV4));
exports.Orders = Orders;
exports.validate = validateOrders;
