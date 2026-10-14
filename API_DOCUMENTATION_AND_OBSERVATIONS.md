# RESTful APIs Lab: Student, Course, and Book Catalogue Services

This project implements three industry-standard Express.js REST APIs adhering to REST architectural constraints, proper HTTP semantics, Mongoose schema modeling with validation, and comprehensive error handling.

---

## 📁 Project Structure

```
├── student-api/                      # Task 1: In-memory REST API
│   ├── package.json
│   └── server.js                     # Port 5001
├── course-api/                       # Task 2: MongoDB Persistent CRUD API
│   ├── models/
│   │   └── Course.js                 # Course schema with validation
│   ├── .env                          # MONGO_URI and PORT configuration
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                     # Port 5002
├── book-api/                         # Task 3: Book Catalogue API with Filtering
│   ├── models/
│   │   └── Book.js                   # Book schema with field & range validators
│   ├── .env                          # MONGO_URI and PORT configuration
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                     # Port 5003
├── postman/
│   └── REST_APIs_Lab_Collection.json # Postman Collection v2.1 (Import-ready)
├── requests.http                     # VS Code / IDE REST Client test file
├── start-all.js                      # Runs all 3 servers concurrently with colored logs
└── test-all.js                       # Automated 23-test integration suite
```

---

## ⚡ Quick Start & Execution Directions

### Option A: Run All 3 APIs Simultaneously (Recommended)
From the project root:
```bash
node start-all.js
```
This boots:
- `student-api` on **http://localhost:5001**
- `course-api` on **http://localhost:5002**
- `book-api` on **http://localhost:5003**

### Option B: Run Each API Individually
Open separate terminal tabs:

**Terminal 1 (Student API):**
```bash
cd student-api
npm start
# Server listens at http://localhost:5001
```

**Terminal 2 (Course API):**
```bash
cd course-api
npm start
# Server listens at http://localhost:5002
```

**Terminal 3 (Book Catalogue API):**
```bash
cd book-api
npm start
# Server listens at http://localhost:5003
```

### Option C: Run the Automated 23-Test Integration Suite
```bash
node test-all.js
```
Runs full end-to-end assertions against all routes, verifies 200/201/400/404 responses, and prints a test report.

---

## 📮 How to Test with Postman

1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file:
   `postman/REST_APIs_Lab_Collection.json`
4. The imported collection **"Web Programming Lab - REST APIs (Tasks 1, 2, 3)"** contains all pre-configured requests organized by task.
5. Click **Send** on each request to inspect the live response body and status code.

---

# 📋 Observation Section (Lab Record Ready)

## Task 1: Basic REST API for Student Records (Port 5001)

### 1.1 GET All Students
- **Method:** `GET`
- **URL:** `http://localhost:5001/students`
- **Request Body:** *None*
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": 1, "name": "Aarav Sharma", "department": "Computer Science", "semester": 6 },
    { "id": 2, "name": "Diya Patel", "department": "Information Science", "semester": 4 },
    { "id": 3, "name": "Rohan Verma", "department": "Electronics & Communication", "semester": 8 },
    { "id": 4, "name": "Sneha Kulkarni", "department": "Mechanical Engineering", "semester": 2 },
    { "id": 5, "name": "Vikram Rao", "department": "Computer Science", "semester": 6 }
  ]
}
```

### 1.2 GET Student by ID (Existing Record)
- **Method:** `GET`
- **URL:** `http://localhost:5001/students/1`
- **Request Body:** *None*
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Aarav Sharma",
    "department": "Computer Science",
    "semester": 6
  }
}
```

### 1.3 GET Student by ID (Non-existent Record)
- **Method:** `GET`
- **URL:** `http://localhost:5001/students/999`
- **Request Body:** *None*
- **Status Code:** `404 Not Found`
- **Response Body:**
```json
{
  "success": false,
  "message": "Student with ID 999 not found"
}
```

### 1.4 POST Create New Student (Valid Payload)
- **Method:** `POST`
- **URL:** `http://localhost:5001/students`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Ananya Sharma",
  "department": "Computer Science",
  "semester": 4
}
```
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 6,
    "name": "Ananya Sharma",
    "department": "Computer Science",
    "semester": 4
  }
}
```

### 1.5 POST Create Student (Validation Failure)
- **Method:** `POST`
- **URL:** `http://localhost:5001/students`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": ""
}
```
- **Status Code:** `400 Bad Request`
- **Response Body:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Field 'name' is required and must be a non-empty string",
    "Field 'department' is required and must be a non-empty string",
    "Field 'semester' is required and must be a number between 1 and 12"
  ]
}
```

---

## Task 2: Persistent CRUD Operations with MongoDB (Port 5002)

### 2.1 POST Create Course (Create Operation)
- **Method:** `POST`
- **URL:** `http://localhost:5002/courses`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "courseCode": "CS301",
  "courseName": "Design and Analysis of Algorithms",
  "department": "Computer Science",
  "credits": 4,
  "semester": 5
}
```
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "6acfd991d7d558b7f8586696",
    "courseCode": "CS301",
    "courseName": "Design and Analysis of Algorithms",
    "department": "Computer Science",
    "credits": 4,
    "semester": 5,
    "createdAt": "2026-10-14T19:35:41.200Z",
    "updatedAt": "2026-10-14T19:35:41.200Z"
  }
}
```

### 2.2 GET All Courses (Read Operation)
- **Method:** `GET`
- **URL:** `http://localhost:5002/courses`
- **Request Body:** *None*
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6acfd991d7d558b7f8586696",
      "courseCode": "CS301",
      "courseName": "Design and Analysis of Algorithms",
      "department": "Computer Science",
      "credits": 4,
      "semester": 5,
      "createdAt": "2026-10-14T19:35:41.200Z",
      "updatedAt": "2026-10-14T19:35:41.200Z"
    }
  ]
}
```

### 2.3 GET Single Course by ID (Read Operation)
- **Method:** `GET`
- **URL:** `http://localhost:5002/courses/6acfd991d7d558b7f8586696`
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "_id": "6acfd991d7d558b7f8586696",
    "courseCode": "CS301",
    "courseName": "Design and Analysis of Algorithms",
    "department": "Computer Science",
    "credits": 4,
    "semester": 5
  }
}
```

### 2.4 PUT Update Course by ID (Update Operation)
- **Method:** `PUT`
- **URL:** `http://localhost:5002/courses/6acfd991d7d558b7f8586696`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "credits": 5,
  "courseName": "Advanced Design and Analysis of Algorithms"
}
```
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "_id": "6acfd991d7d558b7f8586696",
    "courseCode": "CS301",
    "courseName": "Advanced Design and Analysis of Algorithms",
    "department": "Computer Science",
    "credits": 5,
    "semester": 5
  }
}
```

### 2.5 DELETE Course by ID (Delete Operation)
- **Method:** `DELETE`
- **URL:** `http://localhost:5002/courses/6acfd991d7d558b7f8586696`
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "message": "Course 'CS301 - Advanced Design and Analysis of Algorithms' was deleted successfully",
  "data": {
    "_id": "6acfd991d7d558b7f8586696",
    "courseCode": "CS301",
    "courseName": "Advanced Design and Analysis of Algorithms"
  }
}
```

### 2.6 GET Course with Invalid ID Format
- **Method:** `GET`
- **URL:** `http://localhost:5002/courses/invalid-id-format`
- **Status Code:** `400 Bad Request`
- **Response Body:**
```json
{
  "success": false,
  "message": "Invalid course ID format: 'invalid-id-format'"
}
```

### 2.7 Database Persistence Verification across Server Restarts
1. Created Course `CS301` via `POST /courses`.
2. Terminated server process completely (SIGINT / process exit).
3. Restarted server process via `npm start`.
4. Dispatched `GET /courses`. The previously saved course `CS301` was returned, verifying persistence in MongoDB database `course_db`.

---

## Task 3: Book Catalogue API with Filtering & Validation (Port 5003)

### 3.1 POST Add New Book (Valid Request)
- **Method:** `POST`
- **URL:** `http://localhost:5003/books`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "category": "Software Engineering",
  "publicationYear": 2017,
  "availableCopies": 12
}
```
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "success": true,
  "message": "Book added successfully",
  "data": {
    "_id": "6acfd99166c5d7e8287a149b",
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "category": "Software Engineering",
    "publicationYear": 2017,
    "availableCopies": 12
  }
}
```

### 3.2 POST Add Book (Validation Error: Missing Title & Author)
- **Method:** `POST`
- **URL:** `http://localhost:5003/books`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "",
  "author": ""
}
```
- **Status Code:** `400 Bad Request`
- **Response Body:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Field 'title' is required and must not be empty",
    "Field 'author' is required and must not be empty",
    "Field 'category' is required and must not be empty",
    "Field 'publicationYear' is required",
    "Field 'availableCopies' is required"
  ]
}
```

### 3.3 POST Add Book (Validation Error: Negative Available Copies)
- **Method:** `POST`
- **URL:** `http://localhost:5003/books`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Quantum Physics Principles",
  "author": "David Griffiths",
  "category": "Science",
  "publicationYear": 2018,
  "availableCopies": -5
}
```
- **Status Code:** `400 Bad Request`
- **Response Body:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Field 'availableCopies' must be a non-negative integer (>= 0)"
  ]
}
```

### 3.4 GET All Books (Without Query Params)
- **Method:** `GET`
- **URL:** `http://localhost:5003/books`
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "count": 3,
  "appliedFilters": {
    "category": null,
    "author": null
  },
  "data": [
    {
      "_id": "6acfd99166c5d7e8287a149c",
      "title": "A Brief History of Time",
      "author": "Stephen Hawking",
      "category": "Science",
      "publicationYear": 1988,
      "availableCopies": 5
    },
    {
      "_id": "6acfd99166c5d7e8287a149b",
      "title": "Clean Architecture",
      "author": "Robert C. Martin",
      "category": "Software Engineering",
      "publicationYear": 2017,
      "availableCopies": 12
    },
    {
      "_id": "6acfd99166c5d7e8287a149d",
      "title": "Data Structures with C",
      "author": "C. R. Rao",
      "category": "Computer Science",
      "publicationYear": 2020,
      "availableCopies": 8
    }
  ]
}
```

### 3.5 GET Books Filtered by Category (`?category=Science`)
- **Method:** `GET`
- **URL:** `http://localhost:5003/books?category=Science`
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "count": 1,
  "appliedFilters": {
    "category": "Science",
    "author": null
  },
  "data": [
    {
      "_id": "6acfd99166c5d7e8287a149c",
      "title": "A Brief History of Time",
      "author": "Stephen Hawking",
      "category": "Science",
      "publicationYear": 1988,
      "availableCopies": 5
    }
  ]
}
```

### 3.6 GET Books Filtered by Author (`?author=Rao`)
- **Method:** `GET`
- **URL:** `http://localhost:5003/books?author=Rao`
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "count": 1,
  "appliedFilters": {
    "category": null,
    "author": "Rao"
  },
  "data": [
    {
      "_id": "6acfd99166c5d7e8287a149d",
      "title": "Data Structures with C",
      "author": "C. R. Rao",
      "category": "Computer Science",
      "publicationYear": 2020,
      "availableCopies": 8
    }
  ]
}
```

### 3.7 GET Single Book by Unknown Valid ObjectId
- **Method:** `GET`
- **URL:** `http://localhost:5003/books/60c72b2f9b1d8b2bad000000`
- **Status Code:** `404 Not Found`
- **Response Body:**
```json
{
  "success": false,
  "error": "Book not found",
  "details": [
    "No book found with ID '60c72b2f9b1d8b2bad000000'"
  ]
}
```

### 3.8 GET Single Book with Malformed ObjectId
- **Method:** `GET`
- **URL:** `http://localhost:5003/books/bad-object-id`
- **Status Code:** `400 Bad Request`
- **Response Body:**
```json
{
  "success": false,
  "error": "Invalid book ID format",
  "details": [
    "The provided ID 'bad-object-id' is not a valid 24-character hexadecimal MongoDB ObjectId"
  ]
}
```
