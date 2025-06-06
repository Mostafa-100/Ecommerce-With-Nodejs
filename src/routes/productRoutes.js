const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const {
  getProductsValidator,
  getOneProductValidator,
} = require("../validators/productValidator");

const withValidation = require("../utils/withValidation");

router.get(
  "/products",
  ...withValidation(getProductsValidator, productController.getProducts)
);

router.get(
  "/products/:id",
  ...withValidation(getOneProductValidator, productController.getOneProduct)
);

module.exports = router;
