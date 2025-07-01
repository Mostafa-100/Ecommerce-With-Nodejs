const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

exports.getCheckoutSessionUrl = async (cartItems) => {
  const frontendUrl = process.env.FRONTEND_URL;

  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    };
  });

  console.log(`${process.env.FRONTEND_URL}/success`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${frontendUrl}/success`,
    cancel_url: `${frontendUrl}/cancel`,
  });

  return session.url;
};
