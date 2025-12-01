import Book from "../models/Book.js";

// 📌 Create Book
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, categories, description, year, qty } = req.body;

    const coverUrl = req.file?.path;
    if (!coverUrl) {
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
      cover: coverUrl,

      qty: Number(qty),
      available: Number(qty), // initially all available
      borrowed: 0             // nothing borrowed
    });

    await newBook.save();

    res.status(201).json({ book: newBook });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating book" });
  }
};


// 📌 Get all Books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get Single Book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Update Book
export const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, year, qty, description, categories } = req.body;

    let parsedCategories = [];
    try {
      parsedCategories = JSON.parse(categories);
    } catch {
      parsedCategories = [];
    }

    const updatedData = {
      title,
      author,
      isbn,
      year,
      qty,
      description,
      categories: parsedCategories,
    };

    if (req.file) {
      updatedData.cover = req.file.path;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Delete Book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BORROW A BOOK
export const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.available <= 0) {
      return res.status(400).json({ message: "Book is not available" });
    }

    book.available -= 1;
    book.borrowed += 1;

    await book.save();

    res.json({ message: "Book borrowed successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RETURN A BOOK
export const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.borrowed <= 0) {
      return res.status(400).json({ message: "No borrowed copies to return" });
    }

    book.available += 1;
    book.borrowed -= 1;

    await book.save();

    res.json({ message: "Book returned successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
