import { createApp } from "./app";
import { initializeDatabase } from "./services/database";
import chalk from "chalk";

// Start the server and initialize the database
const startServer = async () => {
  const port = process.env.PORT || 3000;

  try {
    // Initialize Database
    const db = await initializeDatabase();

    // Create Express App
    const app = createApp();

    // Attach Database to App
    app.locals.db = db;

    // Start Server
    app.listen(port, () => {
      console.log(chalk.gray(`--------------------------------------`));
      console.log(chalk.green.bold("Server is running!"));
      console.log(chalk.blue(`URL: http://localhost:${port}`));
      console.log(
        chalk.gray(`Environment: ${process.env.NODE_ENV || "development"}`)
      );
    });
  } catch (error) {
    console.error(chalk.red("Failed to start server:"), error);
    process.exit(1);
  }
};

startServer();