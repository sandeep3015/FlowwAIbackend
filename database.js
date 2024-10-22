const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./finance.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, 
      category TEXT NOT NULL, 
      amount REAL NOT NULL, 
      date TEXT NOT NULL, 
      description TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, 
      type TEXT NOT NULL
    );
  `);
});

module.exports = db;
