const Product = require("../models/Product");

exports.fetchProducts = async (limit, offset, sortOrder) => {
  const products = await Product.find({})
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: sortOrder });

  return products;
};

exports.fetchOneProduct = async (id) => {
  const product = await Product.findById(id).populate("category");
  return product;
};
