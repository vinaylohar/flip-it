import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Welcome to the Memory Game API");
});

export default router;