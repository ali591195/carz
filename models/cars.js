const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const Cars = sequelize.define(
  "cars",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
    },
    category_id: {
      //car category
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "cars",
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
        name: "name",
        using: "BTREE",
        fields: [{ name: "name" }],
      },
    ],
  }
);
function validateCars(car) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    category_id: Joi.string().guid().required(),
  });
  return schema.validate(car);
}

Cars.beforeCreate((car) => (car.id = Sequelize.UUIDV4));
exports.Cars = Cars;
exports.validateCars = validateCars;
