export const calculateScore = (guesses: number, timeTakeInSeconds: number): number => {
  return 10000 - (timeTakeInSeconds * 10 + guesses * 10);
};