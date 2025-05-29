import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';
import type { GameVariationValues } from '../config/constants';

export interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  isCurrentPlayer: boolean;
}

export interface HighScoreData {
  player: string;
  guesses: number;
  timeTakeInSeconds: number;
  playerFBId: string | null;
  category: string;
}

// Async thunk to fetch leaderboard data
export const fetchLeaderboardThunk = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (variation: GameVariationValues) => {
    const response = await apiClient.get(`/api/high-scores?category=${variation}`);
    return response.data;
  }
);

// Async thunk submitting high score data
export const submitHighScoreThunk = createAsyncThunk(
  'leaderboard/submitHighScore',
  async (data: HighScoreData) => {
    try {
      const response = await apiClient.post('/api/high-scores', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting high score:', error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  }
);