const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_lists");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList });
Blog.belongsToMany(User, { through: ReadingList });

ReadingList.belongsTo(User, { foreignKey: "userId" });
ReadingList.belongsTo(Blog, { foreignKey: "blogId" });

User.hasMany(ReadingList, { foreignKey: "userId" });

module.exports = { Blog, User, ReadingList };
