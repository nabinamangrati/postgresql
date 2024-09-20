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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "ReadingList",
  }
);
module.exports = ReadingList;
