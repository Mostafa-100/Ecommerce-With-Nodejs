const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.getProducts = async (req, res, next) => {
  const { limit = 10, offset = 0, sort = "desc" } = req.query;
  const sortOrder = sort === "desc" ? -1 : 1;

  try {
    const products = await Product.find({})
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: sortOrder });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    res.json(product);
  } catch (error) {
    next(error);
  }
};
