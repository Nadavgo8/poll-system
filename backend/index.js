// server/index.mjs (ESM)
import "dotenv/config";
import express from "express";
import cors from "cors";

// ✅ import the compiled CJS models bundle
import models from "./models/index.js"; // default export is the db object

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Already initialized by models/index.cjs using DB_CONNECTION
const { sequelize, Poll, Option, Vote } = models;
import pollsRouter from "./routes/polls.js";
app.use("/api/polls", pollsRouter);

const PORT = process.env.PORT || 3000;
await sequelize.authenticate();
console.log("✅ DB connected");
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
