const { v4: uuidv4 } = require("uuid");
const {
  getCart,
  addItemToCart,
  fetchCart,
  migrateCartItems,
  deleteItem,
  deleteCart,
} = require("../services/cartService");
const AppError = require("../utils/AppError");

exports.addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user?.id;
  let guestId = req.cookies.guestId;

  let cartOwnerId = null;

  if (guestId) cartOwnerId = guestId;

  if (userId) cartOwnerId = userId;

  if (!guestId && !userId) {
    guestId = uuidv4();
    cartOwnerId = guestId;
    res.cookie("guestId", guestId, { maxAge: 1000 * 60 * 60 * 24 * 30 });
  }

  const cart = await getCart(cartOwnerId);

  try {
    await addItemToCart(cart, productId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.getCartItems = async (req, res, error) => {
  const userId = req.user?.id;
  const guestId = req.cookies.guestId;
  let userCart = null;

  try {
    if (userId) {
      userCart = await fetchCart(userId);
    }

    if (guestId) {
      const guestCart = await fetchCart(guestId);
      if (guestCart) {
        if (userCart) {
          await migrateCartItems(guestCart, userCart);
        } else {
          res.json(guestCart);
        }
      }
    }

    res.json(userCart);
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const { itemId } = req.body;
  const userId = req.user?.id;
  const guestId = req.cookies.guestId;

  try {
    if (userId) {
      const cart = await fetchCart(userId);

      if (!cart) throw new AppError("cart not found", 404);

      await deleteItem(cart, itemId);
    } else {
      const cart = await fetchCart(guestId);

      if (!cart) throw new AppError("cart not found", 404);

      await deleteItem(cart, itemId);
    }

    res.json({ message: "cart item has been deleted successfuly" });
  } catch (error) {
    next(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  const userId = req.user?.id;
  const guestId = req.cookies.guestId;

  try {
    if (userId) await deleteCart(userId);
    if (guestId) await deleteCart(guestId);

    res.json({ message: "cart has been deleted successfuly" });
  } catch (error) {
    next(error);
  }
};
