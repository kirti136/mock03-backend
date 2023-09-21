const { Router } = require("express");
const { OrderModel } = require("../models/order.model");
const { UserModel } = require("../models/user.model");
const { BookModel } = require("../models/book.model");

const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order-related endpoints
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     requestBody:
 *       description: Order data including user and books
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order placed successfully
 *               order:
 *                 user: "user-id"
 *                 books: ["book-id-1", "book-id-2"]
 *                 totalAmount: 100
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: User not found or Books not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
orderRouter.post("/order", async (req, res) => {
  try {
    const { user, books } = req.body;

    const userPresent = await UserModel.findById(user);
    if (!userPresent) {
      return res.status(404).json({ message: "User not found" });
    }

    const booksPresent = await BookModel.find({ _id: { $in: books } });
    if (booksPresent.length !== books.length) {
      return res.status(400).json({ message: "Books not found" });
    }

    const totalAmount = booksPresent.reduce(
      (total, book) => total + book.price,
      0
    );

    const newOrder = new OrderModel({
      user: user,
      books: books,
      totalAmount,
    });
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with user and book details
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Returns a list of orders with populated user and book details
 *         content:
 *           application/json:
 *             example:
 *               - user: { name: 'John Doe', email: 'johndoe@example.com' }
 *                 books: [{ title: 'Book 1', author: 'Author 1', price: 50 }, { title: 'Book 2', author: 'Author 2', price: 60 }]
 *                 totalAmount: 110
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
orderRouter.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find();

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const populatedBooking = order.toObject();
        populatedBooking.user = await UserModel.findById(order.user);
        populatedBooking.books = await BookModel.findById(order.books);
        return populatedBooking;
      })
    );

    res.status(200).json(populatedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  orderRouter,
};
