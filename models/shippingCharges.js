const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize'),
  sequelize = require('../config/database');
const Joi = require('joi');
const ShippingCharges = sequelize.define(
  'shipping_charges',
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
    store_id: {
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: 'hunting_stores',
        key: 'id',
      },
    },
    to: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    from: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      required: true,
    },
    added_by: {
      //store added by which person
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    updated_by: {
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
    tableName: 'shipping_charges',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
      {
        name: 'shipping_charges_store_id_forign',
        using: 'BTREE',
        fields: [{ name: 'store_id' }],
      },
      {
        name: 'shipping_charges_added_by_forign',
        using: 'BTREE',
        fields: [{ name: 'added_by' }],
      },
      {
        name: 'shipping_charges_updated_by_forign',
        using: 'BTREE',
        fields: [{ name: 'updated_by' }],
      },
    ],
  }
);

function validateShippingCharges(ShippingCharges) {
  const schema = Joi.object({
    index: Joi.number(),
    store_id: Joi.string().guid().required(),
    to: Joi.number().required(),
    from: Joi.number().optional().allow(null),
    charges: Joi.number().required(),
    added_by: Joi.string().guid(),
    updated_by: Joi.string().guid(),
  });
  return schema.validate(ShippingCharges);
}

ShippingCharges.beforeCreate(
  (ShippingCharges) => (ShippingCharges.id = Sequelize.UUIDV4)
);
exports.ShippingCharges = ShippingCharges;
exports.validateShippingCharges = validateShippingCharges;
