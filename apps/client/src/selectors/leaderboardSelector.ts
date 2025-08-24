import type { RootState } from '../store/store';

export const getLeaderboard = (state: RootState) => state.leaderboard;

// Selector to get leaderboard data from the state
export const selectLeaderboardData = (state: RootState) => getLeaderboard(state).data;
export const selectLeaderboardDataError = (state: RootState) => getLeaderboard(state).error;

export const isLeaderboardDataLoading = (state: RootState) => getLeaderboard(state).loading;

export const getWinnerScore = (state: RootState) => getLeaderboard(state).winnerScore;