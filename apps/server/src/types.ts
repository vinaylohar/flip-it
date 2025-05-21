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

export type HighScorePostRequestBody = Omit<HighScore, "id">;

export type HighScoreRequest = Request<{}, {}, HighScorePostRequestBody>;
