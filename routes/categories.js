// server/routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { body, validationResult } = require('express-validator');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST create a new category
router.post(
  '/',
  body('name').notEmpty().withMessage('Category name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const category = new Category(req.body);
      const saved = await category.save();
      res.status(201).json(saved);
    } catch (error) {
      res.status(400).json({ message: 'Error creating category', error });
    }
  }
);

module.exports = router;
