import { Request, Response, NextFunction } from "express";

// Error handling middleware for Express.js applications
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};