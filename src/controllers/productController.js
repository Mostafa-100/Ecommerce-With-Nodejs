const {
  fetchProducts,
  fetchOneProduct,
} = require("../services/productService");

/*
  ######################################
  ##                                  ##
  ##  REDIS CACHING                   ##
  ##  USE SERVICES & Do SINGLE RESPO  ##
  ##  Use cors                        ##
  ##                                  ##
  ######################################
*/

exports.getProducts = async (req, res, next) => {
  const { limit = 10, offset = 0, sort = "desc" } = req.query;
  const sortOrder = sort === "desc" ? -1 : 1;

  try {
    const products = await fetchProducts(limit, offset, sortOrder);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await fetchOneProduct(parseInt(id));
    res.json(product);
  } catch (error) {
    next(error);
  }
};
