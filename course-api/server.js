require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Course = require('./models/Course');

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/course_db';

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Root endpoint: API Overview
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Course Management REST API is operational (MongoDB persistent store)",
    version: "1.0.0",
    endpoints: {
      "POST /courses": "Create a new course",
      "GET /courses": "Retrieve all courses",
      "GET /courses/:id": "Retrieve a specific course by MongoDB ObjectId",
      "PUT /courses/:id": "Update a course by MongoDB ObjectId",
      "DELETE /courses/:id": "Delete a course by MongoDB ObjectId"
    }
  });
});

/**
 * 1. POST /courses
 * Creates a new course document in MongoDB
 */
app.post('/courses', async (req, res) => {
  try {
    const { courseCode, courseName, department, credits, semester } = req.body;

    const course = new Course({
      courseCode,
      courseName,
      department,
      credits,
      semester
    });

    const savedCourse = await course.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: savedCourse
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }

    // Handle duplicate key error (courseCode unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Course with code '${req.body.courseCode}' already exists.`
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message
    });
  }
});

/**
 * 2. GET /courses
 * Retrieves all courses from MongoDB
 */
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message
    });
  }
});

/**
 * 3. GET /courses/:id
 * Retrieves a single course by its MongoDB ObjectId
 */
app.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid course ID format: '${id}'`
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: error.message
    });
  }
});

/**
 * 4. PUT /courses/:id
 * Updates an existing course by its MongoDB ObjectId
 */
app.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid course ID format: '${id}'`
      });
    }

    // Run validators on update
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: `Course with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Another course with this courseCode already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message
    });
  }
});

/**
 * 5. DELETE /courses/:id
 * Deletes a course by its MongoDB ObjectId
 */
app.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid course ID format: '${id}'`
      });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: `Course with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Course '${deletedCourse.courseCode} - ${deletedCourse.courseName}' was deleted successfully`,
      data: deletedCourse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message
    });
  }
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[course-api] Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`[course-api] Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[course-api] MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
