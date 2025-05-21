import { createSlice } from '@reduxjs/toolkit';
import { fetchLeaderboardThunk, submitHighScoreThunk, type LeaderboardEntry } from '../services/apiService';

interface LeaderboardState {
  data: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  winnerScore: number | null;
}

const initialState: LeaderboardState = {
  data: [],
  loading: false,
  error: null,
  winnerScore: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeaderboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leaderboard';
      })

      // Submit high score
      .addCase(submitHighScoreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitHighScoreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.winnerScore = action.payload;
      })
      .addCase(submitHighScoreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit high score';
      });
  },
});

export default leaderboardSlice.reducer;