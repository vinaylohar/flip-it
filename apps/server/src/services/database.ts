import { JSONFilePreset } from "lowdb/node";
import chalk from "chalk";
import { Low } from "lowdb";
import { Database } from "../types";

export const initializeDatabase = async (): Promise<Low<Database>> => {
  console.log(chalk.gray(`Loading database...`));
  const defaultData: Database = { scores: [] };
  const db = await JSONFilePreset("db.json", defaultData);

  console.log(chalk.green(`Database loaded.`));
  return db;
};