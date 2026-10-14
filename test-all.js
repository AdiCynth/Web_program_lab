/**
 * Automated Test Runner for Tasks 1, 2, and 3
 * Tests all endpoints, validates status codes & responses, and generates observation logs.
 */

const { spawn } = require('child_process');
const path = require('path');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('='.repeat(70));
  console.log('🚀 STARTING API SERVERS FOR INTEGRATION TESTING');
  console.log('='.repeat(70));

  // Spawn student-api on 5001
  const studentProcess = spawn('node', ['student-api/server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '5001' }
  });

  // Spawn course-api on 5002
  const courseProcess = spawn('node', ['course-api/server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '5002', MONGO_URI: 'mongodb://127.0.0.1:27017/course_db' }
  });

  // Spawn book-api on 5003
  const bookProcess = spawn('node', ['book-api/server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '5003', MONGO_URI: 'mongodb://127.0.0.1:27017/book_db' }
  });

  const cleanup = () => {
    try { studentProcess.kill(); } catch (e) {}
    try { courseProcess.kill(); } catch (e) {}
    try { bookProcess.kill(); } catch (e) {}
  };

  process.on('SIGINT', cleanup);
  process.on('exit', cleanup);

  // Wait 2 seconds for servers to connect and bind ports
  await delay(2500);

  let passed = 0;
  let failed = 0;

  async function testEndpoint(testName, method, url, body, expectedStatus) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));

      const isPass = res.status === expectedStatus;
      if (isPass) {
        passed++;
        console.log(`\x1b[32m✔ [PASS]\x1b[0m ${testName} -> ${method} ${url} [Status: ${res.status}]`);
      } else {
        failed++;
        console.log(`\x1b[31m✘ [FAIL]\x1b[0m ${testName} -> ${method} ${url} [Expected ${expectedStatus}, Got ${res.status}]`);
      }
      return { status: res.status, data };
    } catch (err) {
      failed++;
      console.log(`\x1b[31m✘ [ERR]\x1b[0m ${testName} -> ${method} ${url} [${err.message}]`);
      return { status: 500, error: err.message };
    }
  }

  console.log('\n--- TASK 1: STUDENT API (Port 5001) ---');
  await testEndpoint('1.1 GET All Students', 'GET', 'http://localhost:5001/students', null, 200);
  await testEndpoint('1.2 GET Student by ID (1)', 'GET', 'http://localhost:5001/students/1', null, 200);
  await testEndpoint('1.3 GET Missing Student (999)', 'GET', 'http://localhost:5001/students/999', null, 404);
  await testEndpoint('1.4 POST New Student', 'POST', 'http://localhost:5001/students', {
    name: 'Ananya Sharma',
    department: 'Computer Science',
    semester: 4
  }, 201);
  await testEndpoint('1.5 POST Invalid Student (missing fields)', 'POST', 'http://localhost:5001/students', {
    name: ''
  }, 400);

  console.log('\n--- TASK 2: COURSE API CRUD WITH MONGODB (Port 5002) ---');
  const uniqueCode = `CS${Math.floor(100 + Math.random() * 900)}`;
  const postCourseRes = await testEndpoint('2.1 POST /courses (Create Course)', 'POST', 'http://localhost:5002/courses', {
    courseCode: uniqueCode,
    courseName: 'Cloud Computing & DevOps',
    department: 'Computer Science',
    credits: 4,
    semester: 6
  }, 201);

  const courseId = postCourseRes.data?.data?._id;

  await testEndpoint('2.2 GET /courses (Retrieve All Courses)', 'GET', 'http://localhost:5002/courses', null, 200);

  if (courseId) {
    await testEndpoint('2.3 GET /courses/:id (Retrieve Single Course)', 'GET', `http://localhost:5002/courses/${courseId}`, null, 200);
    await testEndpoint('2.4 PUT /courses/:id (Update Course Credits)', 'PUT', `http://localhost:5002/courses/${courseId}`, {
      credits: 5
    }, 200);
    await testEndpoint('2.5 DELETE /courses/:id (Delete Course)', 'DELETE', `http://localhost:5002/courses/${courseId}`, null, 200);
  }

  await testEndpoint('2.6 GET /courses/:id (Non-existent ID -> 404)', 'GET', 'http://localhost:5002/courses/60c72b2f9b1d8b2bad000000', null, 404);
  await testEndpoint('2.7 GET /courses/:id (Malformed ID -> 400)', 'GET', 'http://localhost:5002/courses/invalid-id-format', null, 400);

  console.log('\n--- TASK 3: BOOK CATALOGUE API WITH FILTERING & VALIDATION (Port 5003) ---');
  const postBookRes1 = await testEndpoint('3.1 POST /books (Add Valid Book 1)', 'POST', 'http://localhost:5003/books', {
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    publicationYear: 2017,
    availableCopies: 12
  }, 201);

  await testEndpoint('3.2 POST /books (Add Valid Book 2 - Science)', 'POST', 'http://localhost:5003/books', {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    publicationYear: 1988,
    availableCopies: 5
  }, 201);

  await testEndpoint('3.3 POST /books (Add Valid Book 3 - Rao)', 'POST', 'http://localhost:5003/books', {
    title: 'Data Structures with C',
    author: 'C. R. Rao',
    category: 'Computer Science',
    publicationYear: 2020,
    availableCopies: 8
  }, 201);

  await testEndpoint('3.4 POST /books (Missing required title/author -> 400)', 'POST', 'http://localhost:5003/books', {
    title: '',
    author: ''
  }, 400);

  await testEndpoint('3.5 POST /books (Negative availableCopies -> 400)', 'POST', 'http://localhost:5003/books', {
    title: 'Test Book',
    author: 'Tester',
    category: 'General',
    publicationYear: 2021,
    availableCopies: -5
  }, 400);

  await testEndpoint('3.6 GET /books (Retrieve all books)', 'GET', 'http://localhost:5003/books', null, 200);
  await testEndpoint('3.7 GET /books?category=Science (Filter by category)', 'GET', 'http://localhost:5003/books?category=Science', null, 200);
  await testEndpoint('3.8 GET /books?author=Rao (Filter by author)', 'GET', 'http://localhost:5003/books?author=Rao', null, 200);

  const bookId = postBookRes1.data?.data?._id;
  if (bookId) {
    await testEndpoint('3.9 GET /books/:id (Valid book ID)', 'GET', `http://localhost:5003/books/${bookId}`, null, 200);
  }
  await testEndpoint('3.10 GET /books/:id (Missing book ID -> 404)', 'GET', 'http://localhost:5003/books/60c72b2f9b1d8b2bad000000', null, 404);
  await testEndpoint('3.11 GET /books/:id (Invalid format ID -> 400)', 'GET', 'http://localhost:5003/books/bad-object-id', null, 400);

  console.log('\n' + '='.repeat(70));
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('='.repeat(70));

  cleanup();
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
