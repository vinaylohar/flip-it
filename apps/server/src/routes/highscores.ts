import express from "express";
import { ParsedQs } from "qs";
import { calculateScore } from "../utils/helper";
import { validateHighScoreGetReuest, validateHighScoreSubmission } from "../middleware/highscore";

// High Scores Router
const router = express.Router();

// Retrieves the leaderboard for a specific category
router.get("/", validateHighScoreGetReuest, (req, res) => {
    // Access the database from the app locals
    const db = req.app.locals.db;
    const playerFBId = req.headers["playerfbid"];
    const category = req.query?.category ?? "";

    const allScores = db.data?.scores.filter((score: { category: string; }) => score.category === category) ?? []; // Filter scores by category
    const sortedScores = allScores.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score); // Sort scores in descending order

    const currentPlayerIndex = sortedScores.findIndex((s: { playerFBId: string; }) => s.playerFBId === playerFBId); // Find the index of the current player
    const currentPlayerScore = sortedScores[currentPlayerIndex]; // Get the current player's score if they exist
    const currentPlayerRank = currentPlayerIndex + 1; // Calculate the current player's rank (1-based index)

    const topScores = sortedScores.slice(0, 10);// Get the top 10 scores
    // If the current player is not in the top 10, include their score at the end of the leaderboard
    const leaderboardView = topScores.map((score: { player: any; score: any; playerFBId: string; }, index: number) => ({
        rank: index + 1,
        username: score.player,
        score: score.score,
        isCurrentPlayer: score.playerFBId === playerFBId,
    }));
    if (currentPlayerScore && currentPlayerRank > 10) {
        leaderboardView.push({
            rank: currentPlayerRank,
            username: currentPlayerScore.player,
            score: currentPlayerScore.score,
            isCurrentPlayer: true,
        });
    }

    res.json(leaderboardView);
});

// Submits a new high score
router.post("/", validateHighScoreSubmission, async (req, res) => {
    const db = req.app.locals.db; // Access the database from the app locals
    const { body } = req;
    // Extract playerFBId from headers, ensuring it's a string
    const playerFBId = Array.isArray(req.headers["playerfbid"]) ? req.headers["playerfbid"][0] : req.headers["playerfbid"] || "";
    const { player = "", guesses = 0, timeTakeInSeconds = 0, category = "" } = body;

    const id = crypto.randomUUID();
    const currentScore = {
        id,
        player,
        guesses,
        timeTakeInSeconds,
        playerFBId,
        score: calculateScore(guesses, timeTakeInSeconds), // Calculate the score based on guesses and time
        category,
    };

    try {
        const userExistingScore = db.data?.scores.find((s: { playerFBId: string; category: string; }) => s.playerFBId === playerFBId && s.category === category);
        // Check if the user already has a score in the specified category
        if (userExistingScore && userExistingScore.score < currentScore.score) {
            db.data.scores = db.data.scores.map((s: { playerFBId: string; }) =>
                s.playerFBId === playerFBId ? { ...s, score: currentScore.score } : s
            );
        } else if (!userExistingScore) {
            // If the user doesn't have an existing score, add the new score
            db.data.scores.push(currentScore);
        }

        await db.write();
        res.status(201).json(currentScore.score);
    } catch (error) {
        res.status(500).json({ error: "Unable to save score" });
    }
});

export default router;