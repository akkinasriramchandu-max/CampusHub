// Simple seed script to create a default admin account.
// Usage: node seed.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = "admin@college.edu";
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log("Admin already exists:", adminEmail);
    process.exit();
  }

  const admin = await User.create({
    name: "Portal Admin",
    email: adminEmail,
    password: "admin123",
    role: "admin",
  });

  console.log("Admin created:", admin.email, "| password: admin123");
  process.exit();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
