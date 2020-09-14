const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Connection {
  static async connect() {
    if (this.db) {
      return this.db;
    }

    const dbName = path.join(__dirname, 'data', 'apptest.db');
    this.db = new sqlite3.Database(dbName, (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    try {
      await Connection.run('DROP TABLE IF EXISTS recipes', []);
      const sqlCreate = `CREATE TABLE IF NOT EXISTS recipes (
        recipe_id INTEGER PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        shortDescription VARCHAR(255) NOT NULL,
        preparationTime INT
      );`;
      await Connection.run(sqlCreate, []);
    } catch (err) {
      console.error(err.message);
    }

    return this.db;
  }

  static async run(sql, params) {
    return new Promise((resolve, reject) => {
      Connection.db.run(sql, params, function complete(error) {
        if (error) {
          reject(error);
        } else {
          resolve({ ...this });
        }
      });
    });
  }

  static async all(sql, params) {
    return new Promise((resolve, reject) => {
      Connection.db.all(sql, params, function complete(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async get(sql, params) {
    return new Promise((resolve, reject) => {
      Connection.db.get(sql, params, function complete(error, row) {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }
}

Connection.db = null;

module.exports = { Connection };
