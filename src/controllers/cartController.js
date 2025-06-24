const { v4: uuidv4 } = require("uuid");
const {
  getCart,
  addItemToCart,
  fetchCart,
  migrateCartItems,
} = require("../services/cartService");

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

  const cartOwnerId = user?.id ?? guestId;

  console.log("user id: ", user);

  const cart = await getCart(cartOwnerId);

  try {
    await addItemToCart(cart, productId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.getCartItems = async (req, res) => {
  const user = req.user;
  const guestId = req.cookies.guestId;
  let userCart = null;

  if (user) {
    console.log("User", user);
    userCart = await fetchCart(user.id);
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
};
