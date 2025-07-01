const { fetchCart } = require("../services/cartService");
const { getCheckoutSessionUrl } = require("../services/paymentService");
const AppError = require("../utils/AppError");

exports.createCheckoutSession = async (req, res, next) => {
  const user = req.user;

  try {
    if (!user) {
      throw new AppError("You must logged in to checkout", 401);
    }

    const cart = await fetchCart(user._id.toString());

    if (!Array.isArray(cart.items) || cart.items.length < 1) {
      throw new AppError("Cart is empty", 404);
    }

    const checkoutSessionUrl = await getCheckoutSessionUrl(cart.items);

    res.json({ url: checkoutSessionUrl });
  } catch (error) {
    next(error);
  }
};
