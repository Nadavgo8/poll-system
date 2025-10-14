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
// /** Helper: poll + tallies (FULL_GROUP_BY safe) */
// async function getPollWithTallies(pollId) {
//   const poll = await Poll.findByPk(pollId, { raw: true });
//   if (!poll) return null;

//   const rows = await Option.findAll({
//     where: { pollId },
//     attributes: [
//       "id",
//       "text",
//       "position",
//       [fn("COUNT", col("votes.id")), "votes"],
//     ],
//     include: [{ model: Vote, as: "votes", attributes: [], required: false }],
//     group: ["Option.id", "Option.text", "Option.position"],
//     order: [["position", "ASC"]],
//     raw: true,
//   });

//   const total = rows.reduce((s, r) => s + Number(r.votes), 0);
//   const options = rows.map((r) => ({
//     id: r.id,
//     text: r.text,
//     votes: Number(r.votes),
//     percentage: total ? Math.round((r.votes / total) * 100) : 0,
//   }));

//   return { ...poll, totalVotes: total, options };
// }

// /** Routes */

// // Create poll
// app.post("/api/polls", async (req, res) => {
//   const { title, creator, options } = req.body || {};
//   if (
//     !title ||
//     !creator ||
//     !Array.isArray(options) ||
//     options.length < 2 ||
//     options.length > 8
//   ) {
//     return res.status(400).json({ message: "Invalid payload" });
//   }

//   const t = await sequelize.transaction();
//   try {
//     const poll = await Poll.create(
//       { title: title.trim(), creator: creator.trim() },
//       { transaction: t }
//     );
//     await Option.bulkCreate(
//       options.map((text, i) => ({
//         pollId: poll.id,
//         text: String(text).trim(),
//         position: i,
//       })),
//       { transaction: t }
//     );
//     await t.commit();
//     res.status(201).json({ id: poll.id, link: `/p/${poll.id}` });
//   } catch (e) {
//     await t.rollback();
//     res.status(500).json({ message: "Failed to create poll" });
//   }
// });

// // Get poll + tallies
// app.get("/api/polls/:id", async (req, res) => {
//   const data = await getPollWithTallies(req.params.id);
//   if (!data) return res.status(404).json({ message: "Not found" });
//   res.json(data);
// });

// // Vote once per (poll, username)
// app.post("/api/polls/:id/votes", async (req, res) => {
//   const pollId = Number(req.params.id);
//   const { username, optionId } = req.body || {};
//   if (!username || !optionId)
//     return res.status(400).json({ message: "Invalid payload" });

//   try {
//     // ensure option belongs to poll
//     const opt = await Option.findOne({ where: { id: optionId, pollId } });
//     if (!opt) return res.status(400).json({ message: "Option not in poll" });

//     await Vote.create({
//       pollId,
//       optionId,
//       username: String(username).trim().toLowerCase(),
//     });

//     const data = await getPollWithTallies(pollId);
//     res.status(201).json(data);
//   } catch (e) {
//     if (e.name === "SequelizeUniqueConstraintError") {
//       return res
//         .status(409)
//         .json({ message: "You already voted on this poll" });
//     }
//     res.status(500).json({ message: "Failed to vote" });
//   }
// });

// app.get("/api/polls/:id/results", async (req, res) => {
//   const data = await getPollWithTallies(req.params.id);
//   if (!data) return res.status(404).json({ message: "Not found" });
//   res.json(data);
// });

const PORT = process.env.PORT || 3000;
await sequelize.authenticate();
console.log("✅ DB connected");
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
