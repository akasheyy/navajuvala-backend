import Book from "../models/Book.js";

/* -----------------------------------------------------------
   CREATE BOOK
----------------------------------------------------------- */
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, categories, description, year, qty } = req.body;

    if (!req.file?.path) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const parsedCategories = JSON.parse(categories || "[]");

    const newBook = new Book({
      title,
      author,
      isbn,
      year,
      description,
      categories: parsedCategories,
      cover: req.file.path,
      qty: Number(qty),
      available: Number(qty),
      borrowed: 0
    });

    await newBook.save();

    res.status(201).json({ book: newBook });
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
    res.status(500).json({ message: "Error creating book" });
  }
};

/* -----------------------------------------------------------
   GET ALL BOOKS (Admin) — NO pagination
----------------------------------------------------------- */
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -----------------------------------------------------------
   PUBLIC GET BOOKS — WITH Pagination
----------------------------------------------------------- */
export const getPublicBooks = async (req, res) => {
  try {
    let { page = 1, limit = 12 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const total = await Book.countDocuments();
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      books,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("PUBLIC LIST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -----------------------------------------------------------
   GET SINGLE BOOK
----------------------------------------------------------- */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -----------------------------------------------------------
   UPDATE BOOK
----------------------------------------------------------- */
export const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, year, qty, description, categories } = req.body;

    let parsedCategories = [];
    try {
      parsedCategories = JSON.parse(categories);
    } catch {}

    const updateData = {
      title,
      author,
      isbn,
      year,
      qty,
      description,
      categories: parsedCategories,
    };

    if (req.file) updateData.cover = req.file.path;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -----------------------------------------------------------
   DELETE BOOK
----------------------------------------------------------- */
export const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -----------------------------------------------------------
   BORROW BOOK
----------------------------------------------------------- */
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.available <= 0)
      return res.status(400).json({ message: "Book not available" });

    book.available -= 1;
    book.borrowed += 1;

    await book.save();

    res.json({ message: "Book borrowed", book });
  } catch (error) {
    console.error("BORROW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* -----------------------------------------------------------
   RETURN BOOK
----------------------------------------------------------- */
export const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.borrowed <= 0)
      return res.status(400).json({ message: "No borrowed copies" });

    book.available += 1;
    book.borrowed -= 1;

    await book.save();

    res.json({ message: "Book returned", book });
  } catch (error) {
    console.error("RETURN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
