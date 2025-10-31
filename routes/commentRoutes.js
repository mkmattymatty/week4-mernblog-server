// server/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// ✅ Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Add a comment to a post
router.post("/", async (req, res) => {
  try {
    const { post, author, text } = req.body;
    if (!post || !author || !text)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const newComment = new Comment({ post, author, text });
    await newComment.save();
    res.json({ success: true, data: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
