const {
  fetchCategories,
  fetchProductsByCategory,
} = require("../services/categoryService");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await fetchCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  const categoryName = req.params.name;

  try {
    const products = await fetchProductsByCategory(categoryName);
    res.json(products);
  } catch (error) {
    next(error);
  }
};
