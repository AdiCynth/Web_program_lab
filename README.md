# Experiment 8: Designing and Implementing RESTful APIs using Node.js and Express

**Course:** Web Programming Laboratory (216U01L501)  
**Student Name:** Aditya Chaugala  
**Roll No:** 16014024012  
**Branch:** `Exp8`

---

## 📌 Project Overview
This repository contains the complete implementation and test suite for Experiment 8, encompassing three RESTful APIs developed in Node.js and Express:

1. **Task 1: Student Records API (`student-api`)**
   - In-memory data store with route parameter lookups (`GET /students/:id`).
   - Creation of student records (`POST /students`) with JSON body validation.
   - Status codes: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`.

2. **Task 2: Course Management CRUD with MongoDB (`course-api`)**
   - Persistent database storage connected to MongoDB via Mongoose.
   - Complete CRUD operations: `POST`, `GET`, `GET by ID`, `PUT`, `DELETE`.
   - Mongoose schema validation, ObjectId format validation, and data persistence across restarts.

3. **Task 3: Book Catalogue API with Filtering & Validation (`book-api`)**
   - Query parameter filtering: `GET /books?category=Science` and `GET /books?author=Rao`.
   - Strict validation: Non-empty titles and authors, valid publication years, non-negative available copies ($\ge 0$).
   - Standardized, consistent JSON error responses.

---

## 📁 Repository Structure
```
├── student-api/                      # Task 1: In-memory REST API (Port 5001)
│   ├── package.json
│   └── server.js
├── course-api/                       # Task 2: MongoDB Persistent CRUD API (Port 5002)
│   ├── models/Course.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── book-api/                         # Task 3: Filtering & Validation API (Port 5003)
│   ├── models/Book.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── postman/
│   └── REST_APIs_Lab_Collection.json # Postman Collection v2.1 (Import-ready with tests)
├── requests.http                     # Direct HTTP requests for VS Code REST Client
├── start-all.js                      # Concurrently boots all 3 APIs with colored logs
├── test-all.js                       # Automated integration test runner
├── 2026_WPL_Expt. 8_RestAPI.docx      # Original Lab Manual
└── 2026_WPL_Expt. 8_RestAPI_COMPLETED.docx # Completed Lab Manual (Green font additions)
```

---

## 🚀 How to Run

### Start All 3 Servers:
```bash
node start-all.js
```
- Student API: `http://localhost:5001`
- Course API: `http://localhost:5002`
- Book API: `http://localhost:5003`

### Run Automated Tests (Newman CLI):
```bash
npx newman run postman/REST_APIs_Lab_Collection.json
```
*(All 23 requests and 26 assertions pass with 0 failures).*
