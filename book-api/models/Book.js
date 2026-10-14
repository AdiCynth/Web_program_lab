const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required and cannot be empty'],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === 'string' && v.trim().length > 0;
        },
        message: 'title cannot be blank or whitespace'
      }
    },
    author: {
      type: String,
      required: [true, 'author is required and cannot be empty'],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === 'string' && v.trim().length > 0;
        },
        message: 'author cannot be blank or whitespace'
      }
    },
    category: {
      type: String,
      required: [true, 'category is required and cannot be empty'],
      trim: true
    },
    publicationYear: {
      type: Number,
      required: [true, 'publicationYear is required'],
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v >= 1000 && v <= currentYear + 1;
        },
        message: (props) => `${props.value} is not a valid publication year (must be an integer between 1000 and ${currentYear + 1})`
      }
    },
    availableCopies: {
      type: Number,
      required: [true, 'availableCopies is required'],
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v >= 0;
        },
        message: (props) => `${props.value} is not a valid number of copies (must be a non-negative integer >= 0)`
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index for efficient query parameter lookups
bookSchema.index({ category: 1, author: 1 });

module.exports = mongoose.model('Book', bookSchema);
