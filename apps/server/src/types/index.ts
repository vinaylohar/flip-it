import { Request } from "express";

// This file defines the types and interfaces used in the high score feature of the Memory Game API.
export interface HighScore {
  id: string;
  player: string;
  guesses: number;
  timeTakeInSeconds: number;
  playerFBId: string;
  score: number;
  category: string;
}

export interface Database {
  scores: HighScore[];
}

export type HighScorePostRequestBody = Omit<HighScore, "id">;

export type HighScoreRequest = Request<{}, {}, HighScorePostRequestBody>;

export interface Database {
  scores: HighScore[];
}


