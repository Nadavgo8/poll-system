// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

// models/index.js  (ESM)
// models/index.js (ESM)
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build Sequelize from your DB URL (use_env_variable: "DB_CONNECTION")
const sequelize = new Sequelize(process.env.DB_CONNECTION, {
  dialect: "mysql",
  logging: false,
});

const db = {};

// 🔧 Windows-safe dynamic import: convert to file:// URL
for (const file of fs.readdirSync(__dirname)) {
  if (
    file !== path.basename(__filename) &&
    file.endsWith(".js") &&
    !file.endsWith(".test.js")
  ) {
    const filePath = path.join(__dirname, file);
    const url = pathToFileURL(filePath).href; // ⬅️ key line
    const mod = await import(url);
    const define = mod.default || mod.define;
    if (typeof define === "function") {
      const model = define(sequelize, DataTypes);
      db[model.name] = model;
    }
  }
}

// wire associations
Object.values(db).forEach((m) => m.associate && m.associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
