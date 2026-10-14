/**
 * Unified Server Runner
 * Runs all three REST APIs concurrently with formatted console prefixes.
 */

const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'student-api', dir: 'student-api', file: 'server.js', port: 5001, color: '\x1b[36m' },
  { name: 'course-api ', dir: 'course-api', file: 'server.js', port: 5002, color: '\x1b[33m' },
  { name: 'book-api   ', dir: 'book-api', file: 'server.js', port: 5003, color: '\x1b[35m' }
];

const reset = '\x1b[0m';
const processes = [];

console.log('='.repeat(70));
console.log('🚀 Starting All 3 REST API Servers');
console.log('='.repeat(70));

services.forEach((srv) => {
  const child = spawn('node', [srv.file], {
    cwd: path.join(__dirname, srv.dir),
    env: { ...process.env, PORT: srv.port }
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`${srv.color}[${srv.name}]${reset} ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`${srv.color}[${srv.name} ERR]${reset} ${data}`);
  });

  child.on('close', (code) => {
    console.log(`${srv.color}[${srv.name}]${reset} Exited with code ${code}`);
  });

  processes.push(child);
});

function shutdown() {
  console.log('\nStopping all servers...');
  processes.forEach((p) => {
    try { p.kill(); } catch (e) {}
  });
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
