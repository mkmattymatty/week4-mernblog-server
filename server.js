// server.js - Main server file for the MERN blog application
const commentRoutes = require("./routes/commentRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images and static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Log all requests (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

// ✅ Import routes
const postRoutes = require("./routes/posts");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");

// ✅ Mount routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ MERN Blog API is running...");
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ✅ Auto Seed Function (runs once when DB connects)
const seedDatabase = async () => {
  const Post = require("./models/Post");
  const Category = require("./models/Category");

  try {
    const postCount = await Post.countDocuments();
    const categoryCount = await Category.countDocuments();

    if (postCount === 0 && categoryCount === 0) {
      console.log("🌱 Seeding default data...");

      const categories = await Category.insertMany([
        { name: "Technology" },
        { name: "Programming" },
        { name: "Lifestyle" },
      ]);

      await Post.insertMany([
        {
          title: "Welcome to the Blog",
          content: "This is the first seeded post!",
          author: "admin",
          category: categories[0]._id,
          image: "",
        },
        {
          title: "Learning MERN Stack",
          content: "MERN stands for MongoDB, Express, React, and Node.js.",
          author: "admin",
          category: categories[1]._id,
          image: "",
        },
      ]);

      console.log("✅ Database seeded successfully!");
    } else {
      console.log("✅ Data already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

// ✅ Start server only after DB connection
mongoose.connection.once("open", async () => {
  console.log("✅ MongoDB connected!");
  await seedDatabase();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// ✅ Graceful shutdown on unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

module.exports = app;
