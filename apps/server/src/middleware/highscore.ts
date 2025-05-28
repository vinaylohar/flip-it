import express, { NextFunction } from "express";
import { HighScoreRequest } from "../types";

export async function validateHighScoreSubmission(
  req: HighScoreRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const playerFBId = req.headers['playerfbid'];

  const { player, guesses, timeTakeInSeconds } = req.body;

  const errors: string[] = [];

  if (typeof playerFBId !== "string" || !playerFBId) {
    errors.push("missing mandatory header params");
  }

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

export async function validateHighScoreGetReuest(
  req: HighScoreRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const playerFBId = req.headers['playerfbid'];
  const category = req.query?.category ?? "";

  const errors: string[] = [];

  if (typeof playerFBId !== "string" || !playerFBId) {
    errors.push("missing mandatory header params");
  }

  if (typeof category !== "string" || !category) {
    errors.push("missing mandatory query parameter: category");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Invalid request body", details: errors });
  } else {
    next();
  }
}
