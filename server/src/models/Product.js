const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  stock: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: false
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;