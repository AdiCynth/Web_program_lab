const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory data store with 5 initial student records
let students = [
  { id: 1, name: "Aarav Sharma", department: "Computer Science", semester: 6 },
  { id: 2, name: "Diya Patel", department: "Information Science", semester: 4 },
  { id: 3, name: "Rohan Verma", department: "Electronics & Communication", semester: 8 },
  { id: 4, name: "Sneha Kulkarni", department: "Mechanical Engineering", semester: 2 },
  { id: 5, name: "Vikram Rao", department: "Computer Science", semester: 6 }
];

// Helper to track next available ID
let nextId = 6;

// Root endpoint: quick API status & usage guide
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Student Records REST API is operational",
    version: "1.0.0",
    endpoints: {
      "GET /students": "Retrieve all students",
      "GET /students/:id": "Retrieve a single student by ID",
      "POST /students": "Create a new student (Body: { name, department, semester })"
    }
  });
});

/**
 * GET /students
 * Retrieves the complete list of students
 * Response: 200 OK
 */
app.get('/students', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

/**
 * GET /students/:id
 * Retrieves a single student by numeric ID
 * Response: 200 OK if found, 404 Not Found if missing, 400 Bad Request if ID is invalid
 */
app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: "Student ID must be a valid number"
    });
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * POST /students
 * Accepts a new student object from req.body and appends to in-memory store
 * Response: 201 Created on success, 400 Bad Request if validation fails
 */
app.post('/students', (req, res) => {
  const { name, department, semester } = req.body;

  // Validation
  const errors = [];
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push("Field 'name' is required and must be a non-empty string");
  }
  if (!department || typeof department !== 'string' || !department.trim()) {
    errors.push("Field 'department' is required and must be a non-empty string");
  }
  const parsedSemester = Number(semester);
  if (semester === undefined || isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 12) {
    errors.push("Field 'semester' is required and must be a number between 1 and 12");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    department: department.trim(),
    semester: Math.floor(parsedSemester)
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: newStudent
  });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`[student-api] Server running at http://localhost:${PORT}`);
});

module.exports = app;
