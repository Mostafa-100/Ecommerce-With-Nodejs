const Category = require("../models/Category");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.fetchCategories = async () => {
  const categories = await Category.find({});
  return categories;
};

exports.fetchProductsByCategory = async (categoryName) => {
  const category = await Category.findOne({ name: categoryName });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const products = await Product.find().populate({
    path: "category",
    match: { name: categoryName },
    select: "-_id -createdAt",
  });

  return products;
};
