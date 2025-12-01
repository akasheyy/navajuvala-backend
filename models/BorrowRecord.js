import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    bookTitle: { type: String, required: true },

    borrowerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    borrowDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date, required: true },
    notes: { type: String },

    returned: { type: Boolean, default: false },
    returnedAt: { type: Date, default: null },

    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false } // optional if you have admins
  },
  { timestamps: true }
);

export default mongoose.model("BorrowRecord", borrowRecordSchema);
