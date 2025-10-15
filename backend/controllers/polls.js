import { fn, col } from "sequelize";
import models from "../models/index.js"; // default export is { sequelize, Sequelize, Poll, Option, Vote }
const { sequelize, Poll, Option, Vote } = models;

async function getPollWithTallies(pollId) {
  const poll = await Poll.findByPk(pollId, { raw: true });
  if (!poll) return null;

  const rows = await Option.findAll({
    where: { pollId },
    attributes: [
      "id",
      "text",
      "position",
      [fn("COUNT", col("votes.id")), "votes"],
    ],
    include: [{ model: Vote, as: "votes", attributes: [], required: false }],
    group: ["Option.id", "Option.text", "Option.position"],
    order: [["position", "ASC"]],
    raw: true,
  });

  const total = rows.reduce((s, r) => s + Number(r.votes), 0);
  const options = rows.map((r) => ({
    id: r.id,
    text: r.text,
    votes: Number(r.votes),
    percentage: total ? Math.round((r.votes / total) * 100) : 0,
  }));

  return { ...poll, totalVotes: total, options };
}

export async function createPoll(req, res) {
  const { title, creator, options } = req.body || {};
  if (
    !title ||
    !creator ||
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 8
  ) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const t = await sequelize.transaction();
  try {
    const poll = await Poll.create(
      { title: title.trim(), creator: creator.trim() },
      { transaction: t }
    );
    await Option.bulkCreate(
      options.map((text, i) => ({
        pollId: poll.id,
        text: String(text).trim(),
        position: i,
      })),
      { transaction: t }
    );
    await t.commit();
    return res.status(201).json({ id: poll.id, link: `/p/${poll.id}` });
  } catch (e) {
    await t.rollback();
    console.error("createPoll error:", e);
    return res.status(500).json({ message: "Failed to create poll" });
  }
}

export async function getPoll(req, res) {
  const data = await getPollWithTallies(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });
  return res.json(data);
}

export async function getResults(req, res) {
  return getPoll(req, res);
}

export async function voteOnPoll(req, res) {
  const pollId = Number(req.params.id);
  const { username, optionId } = req.body || {};
  if (!username || !optionId) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  try {
    const opt = await Option.findOne({ where: { id: optionId, pollId } });
    if (!opt) return res.status(400).json({ message: "Option not in poll" });

    await Vote.create({
      pollId,
      optionId,
      username: String(username).trim().toLowerCase(),
    });

    const data = await getPollWithTallies(pollId);
    return res.status(201).json(data);
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "You already voted on this poll" });
    }
    console.error("voteOnPoll error:", e);
    return res.status(500).json({ message: "Failed to vote" });
  }
}

export async function listPolls(req, res) {
  const limit = Math.min(parseInt(req.query.limit ?? "50", 10), 100);
  const offset = Math.max(parseInt(req.query.offset ?? "0", 10), 0);

  try {
    const rows = await Poll.findAll({
      attributes: [
        "id",
        "title",
        "creator",
        "createdAt",
        [fn("COUNT", col("votes.id")), "totalVotes"], // <-- uses the include alias
      ],
      include: [{ model: Vote, as: "votes", attributes: [], required: false }],
      group: ["Poll.id", "Poll.title", "Poll.creator", "Poll.createdAt"], // FULL_GROUP_BY-safe
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      subQuery: false, // <-- prevents Sequelize from wrapping in a subquery
      raw: true,
    });

    return res.json(rows);
  } catch (e) {
    console.error("listPolls error:", e);
    return res.status(500).json({ message: "Failed to list polls" });
  }
}