const { MongoClient } = require('mongodb');

async function seed() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('Demo1');
    const collection = db.collection('attendance');
    
    // Clear existing just in case
    await collection.deleteMany({});
    
    await collection.insertMany([
      { subjectName: "Advanced Python Programming", faculty: "N/A", planned: 55, conducted: 23, present: 18, leaves: 0, absent: 5 },
      { subjectName: "Computer Organization and Architecture", faculty: "Kirti Sawlani", planned: 56, conducted: 25, present: 15, leaves: 0, absent: 10 },
      { subjectName: "Data Analysis", faculty: "Mansi Kambli", planned: 55, conducted: 26, present: 2, leaves: 0, absent: 24 },
      { subjectName: "Theory of Automata", faculty: "N/A", planned: 19, conducted: 15, present: 13, leaves: 0, absent: 2 }
    ]);
    
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seed();
