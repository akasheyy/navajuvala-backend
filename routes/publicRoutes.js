import express from "express";
import { getBooks, getBookById } from "../controllers/bookController.js";

const router = express.Router();

// Public — no auth required
router.get("/books", getBooks);
router.get("/books/:id", getBookById);
// router.get("/books", getPaginatedBooks);

export default router;
