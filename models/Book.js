import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  year: { type: String },
  description: { type: String },
  categories: { type: [String], default: [] },
  cover: { type: String, required: true },

  qty: { type: Number, required: true, default: 1 },           // total copies
  available: { type: Number, default: 1 },                    // available copies
  borrowed: { type: Number, default: 0 },                     // borrowed copies

}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
