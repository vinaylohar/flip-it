import express from "express";
import cors from "cors";
import chalk from "chalk";
import { errorHandler } from "./middleware/errorHandler";
import rootRoutes from "./routes/index";
import highScoresRoutes from "./routes/highscores";

export const createApp = () => {
    const app = express();

    console.log(chalk.gray(`Initialising Express app...`));

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use("/", rootRoutes);
    app.use("/api/high-scores", highScoresRoutes);

    // Error Handling Middleware
    app.use(errorHandler);

    console.log(chalk.green(`Express app initialized.`));
    return app;
};