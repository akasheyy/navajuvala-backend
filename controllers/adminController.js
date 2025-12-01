import User from "../models/User.js";
import Book from "../models/Book.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  if (admin.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, admin });
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await User.countDocuments({ role: "user" });
    // Assuming transactions are not implemented yet, set to 0
    const totalTransactions = 0;
    // Assuming overdue is not implemented yet, set to 0
    const overdue = 0;

    res.json({
      books: totalBooks,
      members: totalMembers,
      transactions: totalTransactions,
      overdue: overdue,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
