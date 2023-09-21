const { Router } = require("express");
const { BookModel } = require("../models/book.model");

const bookRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books-related endpoints
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Returns a list of all books
 *         content:
 *           application/json:
 *             example:
 *               books: [ { title: 'Book 1', author: 'Author 1' }, { title: 'Book 2', author: 'Author 2' } ]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.get("/books", async (req, res) => {
  try {
    const books = await BookModel.find();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns book data by ID
 *         content:
 *           application/json:
 *             example:
 *               "Book Data": { title: 'Book 1', author: 'Author 1' }
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: Book Not Found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.get("/books/:id", async (req, res) => {
  try {
    const BookID = req.params.id;
    const book = await BookModel.findById(BookID);
    if (!book) {
      res.status(404).json({ message: "Book Not Found" });
    }
    res.status(200).json({ "Book Data": book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/book:
 *   get:
 *     summary: Get books by category
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         description: Category of the books to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a list of books by category
 *         content:
 *           application/json:
 *             example:
 *               books: [ { title: 'Book 1', author: 'Author 1' }, { title: 'Book 2', author: 'Author 2' } ]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.get("/book", async (req, res) => {
  try {
    const { category } = req.query;

    const books = await BookModel.find({ category: category });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/book:
 *   get:
 *     summary: Get books by author and/or category
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: author
 *         required: false
 *         description: Author of the books to retrieve
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         required: false
 *         description: Category of the books to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a list of books based on author and/or category
 *         content:
 *           application/json:
 *             example:
 *               books: [ { title: 'Book 1', author: 'Author 1' }, { title: 'Book 2', author: 'Author 2' } ]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.get("/book", async (req, res) => {
  try {
    const { author, category } = req.query;
    const query = {};

    if (author) query.author = author;
    if (category) query.category = category;

    const books = await BookModel.find(query);
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       description: Book data to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Book added
 *               bookAdded: { title: 'New Book', author: 'New Author', category: 'New Category', price: 10, quantity: 5 }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.post("/books", async (req, res) => {
  try {
    const { title, author, category, price, quantity } = req.body;

    const newBook = new BookModel({
      title,
      author,
      category,
      price,
      quantity,
    });
    await newBook.save();

    res.status(201).json({ message: "Book added", bookAdded: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   patch:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated book data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       204:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: Book not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.patch("/books/:id", async (req, res) => {
  try {
    const BookID = req.params.id;
    const updatedBookData = req.body;

    const updatedBook = await BookModel.findByIdAndUpdate(
      BookID,
      updatedBookData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(204).json({ message: "Book Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: Book not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
bookRouter.delete("/books/:id", async (req, res) => {
  try {
    const BookID = req.params.id;
    await BookModel.findByIdAndDelete(BookID);

    res.status(202).json({ message: "Book Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  bookRouter,
};
