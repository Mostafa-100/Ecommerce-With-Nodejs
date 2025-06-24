const { v4: uuidv4 } = require("uuid");
const { getCart, addItemToCart } = require("../services/cartService");

exports.addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const user = req.user;
  let guestId = req.cookies.guestId;

  /*
    if user is logged in we will use it to make cart
    if not we will use guest id to make the cart
    if neither user is logged in or guest id provided we will create new guest id to make cart
  */

  if (!guestId) {
    guestId = uuidv4();
    res.cookie("guestId", guestId, { maxAge: 1000 * 60 * 60 * 24 * 30 });
  }

  const cartOwnerId = user?._id ?? guestId;

  const cart = await getCart(cartOwnerId);

  try {
    await addItemToCart(cart, productId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
