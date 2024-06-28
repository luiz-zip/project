// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE capturas (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL, photo TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

module.exports = db;
