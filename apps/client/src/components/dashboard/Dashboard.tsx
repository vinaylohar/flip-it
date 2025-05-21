import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import type { AppDispatch } from '../../store/store';
import { fetchLeaderboardThunk } from '../../services/apiService';
import { GameVariation } from '../../config/constants';
import { selectLeaderboardData } from '../../selectors/leaderboardSelector';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from '../../config/utils';
import { FaPlay } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedVariation = (searchParams.get('variation') as GameVariation) || GameVariation.EASY; // Default to EASY

  const leaderboard = useSelector(selectLeaderboardData);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {

    setUserName(Utils.getUsernameFromLocalStorage() || 'Guest'); // Get the username from local storage or default to 'Guest'

    // Fetch leaderboard data
    dispatch(fetchLeaderboardThunk(selectedVariation));

  }, [selectedVariation]);

  const handleVariationChange = (variation: GameVariation) => {
    setSearchParams({ variation }); // Update the URL with the selected variation
    dispatch(fetchLeaderboardThunk(variation)); // Fetch leaderboard data for the new variation
  };

  const handleNavigateToGame = () => {
    navigate(`/game?variation=${selectedVariation}`); // Navigate to the game page without reloading
  };

  return (
    <div className="dashboard-container">
      <div className="left-column">
        <h2>Welcome, {userName || 'Guest'}!</h2>
        <div className="game-options">
          <h3>Choose a Game Variation:</h3>
          <div className="variation-buttons">

            <button
              className={setSelectedVariationStyle(GameVariation.EASY)}
              onClick={() => handleVariationChange(GameVariation.EASY)}
            >
              6x6
            </button>
            <button
              className={setSelectedVariationStyle(GameVariation.MEDIUM)}
              onClick={() => handleVariationChange(GameVariation.MEDIUM)}
            >
              8x6
            </button>
            <button
              className={setSelectedVariationStyle(GameVariation.HARD)}
              onClick={() => handleVariationChange(GameVariation.HARD)}
            >
              10x6
            </button>
          </div>
        </div>
        <button className="play-now-button" onClick={handleNavigateToGame}>
          <FaPlay className="play-icon" /> Play Now
        </button>      </div>
      <div className="right-column">

        <table className="leaderboard-table">
          <thead>
            <tr className="leaderboard-title">
              <h3>Leaderboard</h3>
            </tr>
          </thead>
          <thead>
            <tr className="leaderboard-header">
              <th>Rank</th>
              <th>User Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody className="leaderboard-rows">
            {leaderboard.map((entry) => (
              <tr
                key={entry.rank}
                className={`leaderboard-row ${entry.isCurrentPlayer ? 'highlight' : ''
                  }`}
              >
                <td>{entry.rank}</td>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function setSelectedVariationStyle(variation: GameVariation): string | undefined {
    return selectedVariation === variation ? 'active' : '';
  }
};

export default Dashboard;