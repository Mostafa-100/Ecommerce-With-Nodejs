const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.getCart = async (cartOwnerId) => {
  const cart = await Cart.findOne({ ownerId: cartOwnerId });

  if (!cart) {
    const cart = new Cart({ ownerId: cartOwnerId });
    await cart.save();
    return cart;
  }

  return cart;
};

exports.addItemToCart = async (cart, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const existingItem = cart.items.find((item) => {
    return item.product.toString() === productId;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
};

exports.fetchCart = async (ownerId) => {
  const cart = await Cart.findOne({ ownerId }).populate("items.product");
  return cart;
};

exports.migrateCartItems = async (fromCart, toCart) => {
  toCart.items.push(...fromCart.items);
  await toCart.save();
  await fromCart.deleteMany();
};

exports.deleteItem = async (cart, itemId) => {
  const item = cart.items.find((item) => item._id.toString() === itemId);

  if (!item) {
    throw new AppError("item not found", 404);
  }

  cart.items = cart.items.filter((item) => {
    return item._id.toString() !== itemId;
  });

  await cart.save();
};

exports.deleteCart = async (ownerId) => {
  const cart = await Cart.findOne({ ownerId });

  if (!cart) {
    throw new AppError("cart not found", 404);
  }

  await cart.deleteOne();
};
