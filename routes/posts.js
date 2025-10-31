// routes/posts.js
const express = require("express");
const { body, param } = require("express-validator");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Post = require("../models/Post");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Ensure uploads folder exists
const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image files (jpg, png, webp) are allowed"));
    }
    cb(null, true);
  },
});

// ✅ GET all posts (with search, pagination, category)
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
      ];
    }

    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.safeFind(query);
    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      meta: { total, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET single post
router.get(
  "/:id",
  param("id").isMongoId(),
  validateRequest,
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("author", "name email")
        .populate("category", "name");

      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Create new post
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    const uploadSingle = upload.single("featuredImage");
    uploadSingle(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  body("title").notEmpty().withMessage("Title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("content").notEmpty().withMessage("Content is required"),
  validateRequest,
  async (req, res, next) => {
    try {
      const data = { ...req.body, author: req.user.id };
      if (req.file) data.featuredImage = `/uploads/${req.file.filename}`;

      const post = new Post(data);
      await post.save();

      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Update post
router.put(
  "/:id",
  (req, res, next) => {
    const uploadSingle = upload.single("featuredImage");
    uploadSingle(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  param("id").isMongoId(),
  validateRequest,
  async (req, res, next) => {
    try {
      const update = { ...req.body };
      if (req.file) update.featuredImage = `/uploads/${req.file.filename}`;

      const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });

      if (!post)
        return res.status(404).json({ success: false, message: "Post not found" });

      res.json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Delete post
router.delete(
  "/:id",
  param("id").isMongoId(),
  validateRequest,
  async (req, res, next) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post)
        return res.status(404).json({ success: false, message: "Post not found" });

      res.json({ success: true, message: "Post deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
