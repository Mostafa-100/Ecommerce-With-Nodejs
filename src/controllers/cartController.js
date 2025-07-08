const { v4: uuidv4 } = require("uuid");
const {
  getCart,
  addItemToCart,
  fetchCart,
  deleteItem,
  deleteCart,
} = require("../services/cartService");
const AppError = require("../utils/AppError");

exports.addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user?.id;
  let guestId = req.cookies.guestId;

  if (!guestId && !userId) {
    guestId = uuidv4();
    res.cookie("guestId", guestId, { maxAge: 1000 * 60 * 60 * 24 * 30 });
  }

  try {
    const cart = await getCart(userId ?? guestId);
    await addItemToCart(cart, productId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.getCartItems = async (req, res, error) => {
  const userId = req.user?.id;
  const guestId = req.cookies.guestId;
  let cart = null;

  try {
    if (userId) {
      cart = await fetchCart(userId);
    } else if (guestId) {
      cart = await fetchCart(guestId);
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?.id;
  const guestId = req.cookies.guestId;

  try {
    if (userId) {
      const cart = await fetchCart(userId);

      if (!cart) throw new AppError("cart not found", 404);

      await deleteItem(cart, itemId);
    } else if (guestId) {
      const cart = await fetchCart(guestId);

      if (!cart) throw new AppError("cart not found", 404);

      await deleteItem(cart, itemId);
    } else {
      throw new AppError("owner cart id not provided", 400);
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
    else if (guestId) await deleteCart(guestId);
    else throw new AppError("owner cart id not provided", 400);

    res.json({ message: "cart has been deleted successfuly" });
  } catch (error) {
    next(error);
  }
};
