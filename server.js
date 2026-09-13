const express = require('express');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const bunkCalc = require('./bunkCalc');

const app = express();
const PORT = 3001;

// MongoDB connection string
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'Demo1';
let db;

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected successfully to MongoDB server');
    db = client.db(dbName);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// / (Dashboard)
app.get('/', async (req, res) => {
  try {
    const collection = db.collection('attendance');
    const attendance = await collection.find({}).toArray();

    let totalPlanned = 0;
    let totalConducted = 0;
    let totalPresent = 0;
    
    // If COA drops below 75, we are finished
    const processedAttendance = attendance.map(item => {
      totalPlanned += item.planned;
      totalConducted += item.conducted;
      totalPresent += item.present;
      
      const percentage = (item.present / item.conducted) * 100 || 0;
      const bunks = bunkCalc.bunksAvailable(item.present, item.conducted);
      const needed = bunkCalc.lecturesNeeded(item.present, item.conducted);
      
      let statusClass = 'bg-success-subtle border-success';
      if (percentage < 75) {
        statusClass = 'bg-danger-subtle border-danger';
      } else if (percentage < 80) {
        statusClass = 'bg-warning-subtle border-warning';
      }

      return {
        ...item,
        percentage: percentage.toFixed(1),
        bunksAvailable: bunks,
        lecturesNeeded: needed,
        statusClass
      };
    });

    const aggregates = {
      planned: totalPlanned,
      conducted: totalConducted,
      present: totalPresent,
      percentage: ((totalPresent / totalConducted) * 100 || 0).toFixed(1)
    };

    res.render('index', { attendance: processedAttendance, aggregates });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// /status (Hitlist)
app.get('/status', async (req, res) => {
  try {
    const collection = db.collection('attendance');
    const attendance = await collection.find({}).toArray();
    
    // Server-side filtering for Danger Zone
    const dangerZone = [];
    const safeZone = [];

    attendance.forEach(item => {
      const percentage = item.present / item.conducted;
      const processed = {
        ...item,
        percentage: (percentage * 100).toFixed(1),
        bunksAvailable: bunkCalc.bunksAvailable(item.present, item.conducted),
        lecturesNeeded: bunkCalc.lecturesNeeded(item.present, item.conducted)
      };

      if (percentage < 0.75) {
        dangerZone.push(processed);
      } else {
        safeZone.push(processed);
      }
    });

    res.render('status', { dangerZone, safeZone });
  } catch (error) {
    console.error("Status error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// /simulate (Calculator)
app.get('/simulate', async (req, res) => {
  try {
    const collection = db.collection('attendance');
    const attendance = await collection.find({}).toArray();
    res.render('simulate', { attendance });
  } catch (error) {
    console.error("Simulate error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// /excuses (Alibi Log) GET
app.get('/excuses', async (req, res) => {
  try {
    const collection = db.collection('attendance');
    const attendance = await collection.find({}).toArray();
    res.render('excuses', { attendance, message: null });
  } catch (error) {
    console.error("Excuses error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// /excuses (Alibi Log) POST
app.post('/excuses', async (req, res) => {
  try {
    const { subjectName, excuse } = req.body;
    
    // Log to MongoDB
    const collection = db.collection('attendance');
    await collection.updateOne(
      { subjectName: subjectName },
      { $push: { excuseLog: excuse } }
    );
    
    // Sync write to alibis.txt to fulfill file system requirement
    const logEntry = `[${new Date().toISOString()}] ${subjectName}: ${excuse}\n`;
    fs.writeFileSync(path.join(__dirname, 'alibis.txt'), logEntry, { flag: 'a' });
    
    // Fetch again for re-rendering
    const attendance = await collection.find({}).toArray();
    res.render('excuses', { attendance, message: "Excuse logged successfully to DB and file system." });
  } catch (error) {
    console.error("Excuses POST error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 404 Middleware
app.use((req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] Failed route attempt: ${req.method} ${req.url}\n`;
  try {
    fs.writeFileSync(path.join(__dirname, 'busted.txt'), logMessage, { flag: 'a' });
  } catch (err) {
    console.error("Failed to write to busted.txt", err);
  }
  res.status(404).send("<h1>404 - Not Found</h1><p>The route you're looking for doesn't exist.</p>");
});

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
