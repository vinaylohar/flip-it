import express from "express";
import chalk from "chalk";
import cors from "cors";
import { JSONFilePreset } from "lowdb/node";
import { HighScore, HighScoreRequest } from "./types";
import { validateHighScoreSubmission } from "./middleware/high-score";

interface Database {
  scores: HighScore[];
}

(async () => {
  console.log(chalk.gray(`💭 Loading database...`));
  const defaultData: Database = { scores: [] };
  const db = await JSONFilePreset("db.json", defaultData);

  console.log(chalk.green(`✅ Database loaded...`));

  console.log(chalk.gray(`💭 Initialising Express app...`));
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("✅ Welcome to the Memory Game API");
  });

  app.get("/api/high-scores", (_req, res) => {
    const playerFBId = _req.headers['playerfbid'];
    const category = _req.query.category; // Extract category from query parameters

    if (!playerFBId) {
      res.status(400).json({ error: 'Missing playerFBId in headers' });
    } else if (!category) {
      res.status(400).json({ error: 'Missing category in query parameters' });
    } else {
      // Filter scores by category
      const allScores = db.data?.scores.filter((score) => score.category === category) ?? [];

      // Sort scores in descending order by score
      const sortedScores = allScores.sort((a, b) => b.score - a.score);

      // Find the current player's score and rank
      const currentPlayerIndex = sortedScores.findIndex((s) => s.playerFBId === playerFBId);
      const currentPlayerScore = sortedScores[currentPlayerIndex];
      const currentPlayerRank = currentPlayerIndex + 1; // Rank is 1-based

      // Get the top 10 scores
      const topScores = sortedScores.slice(0, 10);

      // Transform the response to include rank, username, and score
      const leaderboardView = topScores.map((score, index) => ({
        rank: index + 1,
        username: score.player,
        score: score.score,
        isCurrentPlayer: score.playerFBId === playerFBId,
      }));

      // If the current player is not in the top 10, add their score and rank
      if (currentPlayerScore && currentPlayerRank > 10) {
        leaderboardView.push({
          rank: currentPlayerRank,
          username: currentPlayerScore.player,
          score: currentPlayerScore.score,
          isCurrentPlayer: true,
        });
      }

      res.json(leaderboardView);
    }
  });

  app.post(
    "/api/high-scores",
    validateHighScoreSubmission,
    async (req: HighScoreRequest, res: express.Response) => {
      const { body } = req;
      const playerFBId = Array.isArray(req.headers['playerfbid']) ? req.headers['playerfbid'][0] : req.headers['playerfbid'] || "";
      const { player = "", guesses = 0, timeTakeInSeconds = 0, category = "" } = body;
      const id = crypto.randomUUID();
      const currentScore: HighScore = {
        id,
        player,
        guesses,
        timeTakeInSeconds,
        playerFBId,
        score: 10000 - (timeTakeInSeconds * 10 + guesses * 10),
        category
      };

      try {
        const userExistingScore: HighScore | undefined = db.data?.scores.find((s) => s.playerFBId === playerFBId &&  s.category === category);
        // If the player already has a score and the new score is higher, update it
        if (userExistingScore && userExistingScore.score < currentScore.score) {
          // Update the existing score
          // db.data.scores = db.data.scores.map((s) =>
          //   s.playerFBId === playerFBId ? { ...s, ...currentScore } : s
          // );
          db.data.scores = db.data.scores.map((s) =>
            s.playerFBId === playerFBId ? { ...s, score: currentScore.score } : s
          );
          // db.data.scores = db.data.scores.map((s) =>
          //   s.playerFBId === playerFBId ? { ...currentScore, playerFBId: s.playerFBId } : s
          // );
        } else if (!userExistingScore) {
          // Add a new score
          db.data.scores.push(currentScore);
        }

        await db.write();

        res.status(201).json(currentScore.score);
      } catch (error) {
        res.status(500).json({
          error: "Unable to save score",
        });
      }
    }
  );

  console.log(chalk.green(`✅ Express initialised with routes...`));

  app.listen(port, () => {
    console.log(chalk.gray(`--------------------------------------`));
    console.log(chalk.green.bold("🚀 Server is running!"));
    console.log(chalk.blue(`🌐 URL: http://localhost:${port}`));
    console.log(
      chalk.gray(`📦 Environment: ${process.env.NODE_ENV || "development"}`)
    );
  });
})();
