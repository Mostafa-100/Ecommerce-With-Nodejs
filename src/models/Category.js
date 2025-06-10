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

categorySchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  next();
});

function normalizeName(next) {
  if (this.getUpdate().name) {
    const name = this.getUpdate().name;
    this.getUpdate().name = name;
  }

  next();
}

categorySchema.pre("findOneAndUpdate", normalizeName);
categorySchema.pre("updateOne", normalizeName);
categorySchema.pre("updateMany", normalizeName);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
