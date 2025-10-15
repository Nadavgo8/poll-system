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
    const url = pathToFileURL(filePath).href;
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
