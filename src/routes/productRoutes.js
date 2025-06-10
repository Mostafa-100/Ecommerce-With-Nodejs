const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const {
  getProductsValidator,
  getOneProductValidator,
} = require("../validators/productValidator");

const withValidation = require("../utils/withValidation");

router.get(
  "/",
  ...withValidation(getProductsValidator, productController.getProducts)
);

router.get(
  "/:id",
  ...withValidation(getOneProductValidator, productController.getOneProduct)
);

module.exports = router;
