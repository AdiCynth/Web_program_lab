require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_db';

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// API Overview
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Book Catalogue REST API is operational (Filtering & Validation enabled)",
    version: "1.0.0",
    endpoints: {
      "GET /books": "Retrieve all books (Supports optional query params: ?category=...&author=...)",
      "GET /books/:id": "Retrieve a specific book by MongoDB ObjectId",
      "POST /books": "Add a new book with input validation"
    }
  });
});

/**
 * Validation Helper for POST /books
 * Validates title, author, category, publicationYear, and availableCopies
 */
function validateBookInput(body) {
  const details = [];
  const currentYear = new Date().getFullYear();

  // title validation
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    details.push("Field 'title' is required and must not be empty");
  }

  // author validation
  if (!body.author || typeof body.author !== 'string' || body.author.trim().length === 0) {
    details.push("Field 'author' is required and must not be empty");
  }

  // category validation
  if (!body.category || typeof body.category !== 'string' || body.category.trim().length === 0) {
    details.push("Field 'category' is required and must not be empty");
  }

  // publicationYear validation
  if (body.publicationYear === undefined || body.publicationYear === null || body.publicationYear === '') {
    details.push("Field 'publicationYear' is required");
  } else {
    const yearNum = Number(body.publicationYear);
    if (!Number.isInteger(yearNum) || yearNum < 1000 || yearNum > currentYear + 1) {
      details.push(`Field 'publicationYear' must be a valid 4-digit year between 1000 and ${currentYear + 1}`);
    }
  }

  // availableCopies validation
  if (body.availableCopies === undefined || body.availableCopies === null || body.availableCopies === '') {
    details.push("Field 'availableCopies' is required");
  } else {
    const copiesNum = Number(body.availableCopies);
    if (!Number.isInteger(copiesNum) || copiesNum < 0) {
      details.push("Field 'availableCopies' must be a non-negative integer (>= 0)");
    }
  }

  return details;
}

/**
 * 1. GET /books
 * Retrieves all books with optional query filtering:
 * Example: /books?category=Science or /books?author=Rao
 */
app.get('/books', async (req, res, next) => {
  try {
    const { category, author } = req.query;
    const filter = {};

    if (category && typeof category === 'string' && category.trim()) {
      filter.category = { $regex: category.trim(), $options: 'i' };
    }

    if (author && typeof author === 'string' && author.trim()) {
      filter.author = { $regex: author.trim(), $options: 'i' };
    }

    const books = await Book.find(filter).sort({ title: 1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      appliedFilters: {
        category: category || null,
        author: author || null
      },
      data: books
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 2. GET /books/:id
 * Retrieves a single book by MongoDB ObjectId
 */
app.get('/books/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid book ID format",
        details: [`The provided ID '${id}' is not a valid 24-character hexadecimal MongoDB ObjectId`]
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
        details: [`No book found with ID '${id}'`]
      });
    }

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 3. POST /books
 * Adds a new book with validation
 */
app.post('/books', async (req, res, next) => {
  try {
    // Perform preliminary request body validation
    const validationErrors = validateBookInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors
      });
    }

    const { title, author, category, publicationYear, availableCopies } = req.body;

    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      publicationYear: Number(publicationYear),
      availableCopies: Number(availableCopies)
    });

    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: savedBook
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: "Database schema validation failed",
        details: messages
      });
    }
    next(error);
  }
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Resource not found",
    details: [`Route ${req.method} ${req.originalUrl} does not exist on this server`]
  });
});

// Centralized 500 Error Handler returning consistent JSON
app.use((err, req, res, next) => {
  console.error('[book-api] Internal Server Error:', err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: [err.message || "An unexpected error occurred on the server"]
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[book-api] Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[book-api] Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[book-api] MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
