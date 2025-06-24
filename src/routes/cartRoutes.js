const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("/add-to-cart", cartController.addToCart);
router.get("/cart-items", cartController.getCartItems);
router.delete("/delete-cart-item", cartController.deleteCartItem);
router.delete("/delete-cart", cartController.deleteCart);

module.exports = router;
