import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";

// Create borrow record
export const createBorrowRecord = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { borrowerName, phone, address, borrowDate, returnDate, notes } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if ((book.available || book.qty || 0) <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    const record = new BorrowRecord({
  bookId: book._id,
  bookTitle: book.title,
  borrowerName,
  phone,
  address,
  borrowDate: new Date(),        // <-- FIXED (correct local time will show)
  returnDate: new Date(returnDate + "T11:30:00"),
  notes,
  returned: false,
  adminId: req.admin?.id || null,
});

    book.available = (book.available ?? book.qty) - 1;
    book.borrowed = (book.borrowed ?? 0) + 1;

    await record.save();
    await book.save();

    res.status(201).json({ message: "Borrow record created", record, book });
  } catch (error) {
    console.error("createBorrowRecord error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark returned (by borrow record id)
export const returnBorrowRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const record = await BorrowRecord.findById(recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });
    if (record.returned) return res.status(400).json({ message: "Already returned" });

    const book = await Book.findById(record.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    record.returned = true;
    record.returnedAt = new Date();

    book.available = (book.available ?? 0) + 1;
    book.borrowed = Math.max((book.borrowed ?? 1) - 1, 0);

    await record.save();
    await book.save();

    res.json({ message: "Book returned", record, book });
  } catch (error) {
    console.error("returnBorrowRecord error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all borrow records
export const getAllBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error("getAllBorrowRecords error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single borrow record (with optional book info)
export const getBorrowRecord = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    const book = await Book.findById(record.bookId).lean();
    res.json({ record, book });
  } catch (error) {
    console.error("getBorrowRecord error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete borrow record
export const deleteBorrowRecord = async (req, res) => {
  try {
    const record = await BorrowRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (!record.returned) {
      const book = await Book.findById(record.bookId);
      if (book) {
        book.available = (book.available ?? 0) + 1;
        book.borrowed = Math.max((book.borrowed ?? 1) - 1, 0);
        await book.save();
      }
    }

    res.json({ message: "Borrow record deleted" });
  } catch (error) {
    console.error("deleteBorrowRecord error:", error);
    res.status(500).json({ message: error.message });
  }
};
