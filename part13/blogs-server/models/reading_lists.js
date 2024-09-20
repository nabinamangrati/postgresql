const { sequelize } = require("../util/db");
const { Model, DataTypes } = require("sequelize");

class ReadingList extends Model {}
ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userid",
      references: { model: "users", key: "id" },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "blogid",
      references: { model: "blogs", key: "id" },
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,

      defaultValue: false, // Unread by default
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "readinglist",
  }
);
module.exports = ReadingList;
