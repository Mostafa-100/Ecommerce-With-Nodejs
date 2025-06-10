const Category = require("../models/Category");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  const categoryName = req.params.name;

  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // const products = await Product.find({ category: category._id });
    const products = await Product.find().populate({
      path: "category",
      match: { name: categoryName },
      select: "-_id -createdAt",
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};
