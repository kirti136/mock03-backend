const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    books: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    totalAmount: { type: Number },
  },
  {
    versionKey: false,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = {
  OrderModel,
};
