const DataTypes = require("sequelize").DataTypes;
const Sequelize = require("sequelize"),
  sequelize = require("../config/database");
const Joi = require("joi");
const Comments = sequelize.define(
  "comments",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    comment_value: {
      type: DataTypes.TEXT,
      allowNull: false,
      required: true,
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

    display_on: {
      // Hunting ID
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "huntings",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "comments",
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
        name: "comments_added_by",
        using: "BTREE",
        fields: [{ name: "added_by" }],
      },
      {
        name: "comments_display_on",
        using: "BTREE",
        fields: [{ name: "display_on" }],
      },
    ],
  }
);
function validateComments(comments) {
  const schema = Joi.object({
    comment_value: Joi.string().required(),
    added_by: Joi.string().guid(),
    display_on: Joi.string().guid().required(),
  });
  return schema.validate(comments);
}

Comments.beforeCreate((comments) => (comments.id = Sequelize.UUIDV4));
exports.Comments = Comments;
exports.validate = validateComments;
