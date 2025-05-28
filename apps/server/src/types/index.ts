import { Request } from "express";

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


