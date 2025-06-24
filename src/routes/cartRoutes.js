const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

router.post("/add-to-cart", cartController.addToCart);
// router.delete("/delete-cart-item", cartController.deleteItem);
// router.get("/get-cart-items", cartController.getItems);
// router.delete("/delete-cart", cartController.deleteCart);

module.exports = router;
