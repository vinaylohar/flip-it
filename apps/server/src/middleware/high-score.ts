import express, { NextFunction } from "express";
import { HighScoreRequest } from "../types";

export async function validateHighScoreSubmission(
  req: HighScoreRequest,
  res: express.Response,
  next: express.NextFunction
) {
  console.log("Headers: ", req.headers);
  const playerFBId = req.headers['playerfbid'];

  if (!playerFBId) {
    res.status(400).json({ error: 'Missing Mandatory Headers' });
  } else {
    const { player, guesses, timeTakeInSeconds } = req.body;

    const errors: string[] = [];

    if (typeof player !== "string" || player.trim() === "") {
      errors.push("player must be a non-empty string");
    }

    if (typeof playerFBId !== "string" || playerFBId.trim() === "") {
      errors.push("player Firebase Id must be a non-empty string");
    }

    if (typeof guesses !== "number" || isNaN(guesses)) {
      errors.push("guesses must be a valid number");
    }

    if (typeof timeTakeInSeconds !== "number" || isNaN(timeTakeInSeconds)) {
      errors.push("timeTakeInSeconds must be a valid number");
    }

    if (errors.length > 0) {
      res.status(400).json({ error: "Invalid request body", details: errors });
    } else {
      next();
    }
  }
}
