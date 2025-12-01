import express from "express";
import { adminLogin, getDashboardStats } from "../controllers/adminController.js";

import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
} from "../controllers/bookController.js";

import upload from "../middlewares/upload.js";
import authAdmin from "../middlewares/authAdmin.js";

import {
  createBorrowRecord,
  returnBorrowRecord,    // return by record id (if implemented)
  getAllBorrowRecords,
  getBorrowRecord,
  deleteBorrowRecord,
} from "../controllers/borrowController.js";

const router = express.Router();

// Admin Login
router.post("/login", adminLogin);

// Books Management
router.post("/books", authAdmin, upload.single("cover"), createBook);
router.get("/books", authAdmin, getBooks);
router.get("/books/:id", authAdmin, getBookById);
router.put("/books/:id", authAdmin, upload.single("cover"), updateBook);
router.delete("/books/:id", authAdmin, deleteBook);

// Dashboard Stats
router.get("/stats", authAdmin, getDashboardStats);

// Optional quick borrow / return on bookController (if you have those)
router.put("/books/:id/borrow", authAdmin, borrowBook);
router.put("/books/:id/return", authAdmin, returnBook);

// BorrowRecords endpoints (detailed borrower form uses these)
router.post("/books/:id/borrow", authAdmin, createBorrowRecord);          // create borrow record for a book
router.get("/borrow-records", authAdmin, getAllBorrowRecords);           // list all records
router.get("/borrow-records/:id", authAdmin, getBorrowRecord);           // get one record with book info
router.put("/borrow-records/:id/return", authAdmin, returnBorrowRecord); // mark returned by record id
router.delete("/borrow-records/:id", authAdmin, deleteBorrowRecord);     // delete record

export default router;
