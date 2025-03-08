// Import all models
const Post = require("./post");
const Category = require("./category");
const User = require("./user");

// Set up associations between models

// Post belongs to Category (many posts can belong to one category)
Post.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",  // Alias for accessing the associated category from a post
});

// Category has many Posts (one category can have many posts)
Category.hasMany(Post, {
  foreignKey: "categoryId",
  as: "posts",  // Alias for accessing posts associated with a category
});

// User has many Posts (one user can have many posts)
User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",  // When a user is deleted, their posts are also deleted
});

// Post belongs to User (each post belongs to a specific user)
Post.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  Post,
  Category,
  User,
};
