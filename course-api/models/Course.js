const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'courseCode is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9_-]+$/, 'courseCode can only contain alphanumeric characters, hyphens, and underscores']
    },
    courseName: {
      type: String,
      required: [true, 'courseName is required'],
      trim: true,
      minlength: [2, 'courseName must be at least 2 characters long']
    },
    department: {
      type: String,
      required: [true, 'department is required'],
      trim: true
    },
    credits: {
      type: Number,
      required: [true, 'credits is required'],
      min: [1, 'credits must be at least 1'],
      max: [10, 'credits cannot exceed 10']
    },
    semester: {
      type: Number,
      required: [true, 'semester is required'],
      min: [1, 'semester must be between 1 and 8'],
      max: [8, 'semester must be between 1 and 8']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Course', courseSchema);
