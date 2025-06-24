const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema({
  ownerId: {
    type: String,
    required: true,
  },
  items: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
