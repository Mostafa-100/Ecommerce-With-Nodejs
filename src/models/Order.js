const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
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
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: String,
  shippingAddress: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
