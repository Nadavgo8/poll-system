import { Router } from "express";
import {
  listPolls,
  createPoll,
  getPoll,
  voteOnPoll,
  getResults,
} from "../controllers/polls.js";

const router = Router();
router.get("/", listPolls);
router.post("/", createPoll);
router.get("/:id", getPoll);
router.post("/:id/votes", voteOnPoll);
router.get("/:id/results", getResults);
export default router;
