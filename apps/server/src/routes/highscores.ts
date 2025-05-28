import express from "express";
import { ParsedQs } from "qs";
import { calculateScore } from "../utils/helper";
import { validateHighScoreGetReuest, validateHighScoreSubmission } from "../middleware/highscore";

const router = express.Router();

router.get("/", validateHighScoreGetReuest, (req, res) => {
    const db = req.app.locals.db;
    const playerFBId = req.headers["playerfbid"];
    const category = req.query?.category ?? "";

    const allScores = db.data?.scores.filter((score: { category: string | ParsedQs | (string | ParsedQs)[] | undefined; }) => score.category === category) ?? [];
    const sortedScores = allScores.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);

    const currentPlayerIndex = sortedScores.findIndex((s: { playerFBId: string | string[] | undefined; }) => s.playerFBId === playerFBId);
    const currentPlayerScore = sortedScores[currentPlayerIndex];
    const currentPlayerRank = currentPlayerIndex + 1;

    const topScores = sortedScores.slice(0, 10);
    const leaderboardView = topScores.map((score: { player: any; score: any; playerFBId: string | string[] | undefined; }, index: number) => ({
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

router.post("/", validateHighScoreSubmission, async (req, res) => {
    const db = req.app.locals.db;
    const { body } = req;
    const playerFBId = Array.isArray(req.headers["playerfbid"]) ? req.headers["playerfbid"][0] : req.headers["playerfbid"] || "";
    const { player = "", guesses = 0, timeTakeInSeconds = 0, category = "" } = body;

    const id = crypto.randomUUID();
    const currentScore = {
        id,
        player,
        guesses,
        timeTakeInSeconds,
        playerFBId,
        score: calculateScore(guesses, timeTakeInSeconds),
        category,
    };

    try {
        const userExistingScore = db.data?.scores.find((s: { playerFBId: string; category: string; }) => s.playerFBId === playerFBId && s.category === category);
        if (userExistingScore && userExistingScore.score < currentScore.score) {
            db.data.scores = db.data.scores.map((s: { playerFBId: string; }) =>
                s.playerFBId === playerFBId ? { ...s, score: currentScore.score } : s
            );
        } else if (!userExistingScore) {
            db.data.scores.push(currentScore);
        }

        await db.write();
        res.status(201).json(currentScore.score);
    } catch (error) {
        res.status(500).json({ error: "Unable to save score" });
    }
});

export default router;