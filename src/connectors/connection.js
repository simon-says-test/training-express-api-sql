const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

class Connection {
  static async connect() {
    if (this.db) {
      return this.db;
    }

    const dbName = path.join(__dirname, '../../data', 'apptest.db');
    this.db = new sqlite3.Database(dbName, (err) => {
      if (err) {
        logger.error(err.message);
      }
    });

    return this.db;
  }

  static async resetDb() {
    try {
      await Connection.run('DROP TABLE IF EXISTS recipes', []);
      await Connection.run('DROP TABLE IF EXISTS recipe_steps', []);
      const sqlCreateRecipes = `CREATE TABLE IF NOT EXISTS recipes (
        recipe_id INTEGER PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        short_description VARCHAR(255) NOT NULL,
        preparation_time INT
      );`;
      await Connection.run(sqlCreateRecipes, []);
      const sqlCreateSteps = `CREATE TABLE IF NOT EXISTS recipe_steps (
        recipe_step_id INTEGER PRIMARY KEY,
        recipe_id INTEGER NOT NULL,
        step_number VARCHAR(50) NOT NULL,
        step_text VARCHAR(255) NOT NULL,
        FOREIGN KEY (recipe_id)
          REFERENCES recipes (recipe_id)
      );`;
      await Connection.run(sqlCreateSteps, []);
    } catch (err) {
      logger.error(err.message);
    }
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
