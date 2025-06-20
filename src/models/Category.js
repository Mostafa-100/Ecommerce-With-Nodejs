const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
