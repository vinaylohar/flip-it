import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Leaderboard.css';
import type { AppDispatch } from '../../store/store';
import { fetchLeaderboardThunk } from '../../services/apiService';
import { GAME_VARIATIONS, GameVariationValues } from '../../config/constants';
import { selectLeaderboardData, selectLeaderboardDataError } from '../../selectors/leaderboardSelector';
import { useSearchParams } from 'react-router-dom';
import { Utils } from '../../config/utils';
const Leaderboard: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedVariation = (searchParams.get('variation') as GameVariationValues) || Utils.getDefaultVariation();

  const leaderboard = useSelector(selectLeaderboardData);
  const leaderboardDataError = useSelector(selectLeaderboardDataError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    setUserName(Utils.getUsernameFromLocalStorage() || 'Guest'); // Get the username from local storage or default to 'Guest'

    // Fetch leaderboard data
    dispatch(fetchLeaderboardThunk(selectedVariation));

  }, [dispatch, selectedVariation]);

  const handleVariationChange = (variation: GameVariationValues) => {
    setSearchParams({ variation }); // Update the URL with the selected variation
    dispatch(fetchLeaderboardThunk(variation)); // Fetch leaderboard data for the new variation
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="dashboard-container">
      <div className="grouped-buttons">
        {GAME_VARIATIONS.filter(v => v.isVisible).map((variation) => (
          <button
            key={variation.value}
            className={`variation-button ${selectedVariation === variation.value ? "active" : ""}`}
            onClick={() => handleVariationChange(variation.value)}
          >
            {variation.name}
          </button>
        ))}
      </div>

      <div className="leaderboard-container" aria-live="polite">
        {leaderboardDataError ? (
          <div className="leaderboard-error">
            Failed to load leaderboard: {String(leaderboardDataError)}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="leaderboard-empty">No leaderboard data.</div>
        ) : (
          <table className="leaderboard-table">
            <tbody>
              {leaderboard.map((player, index) => {
                let playerClass = "";
                if (index === 0) playerClass += " gold-medal";
                else if (index === 1) playerClass += " silver-medal";
                else if (index === 2) playerClass += " bronze-medal";
                return (
                  <tr className={player.username === userName ? "current-player" : ""} key={index}>
                    <td className="column-1">
                      {index < 3 && <span className={playerClass.trim()}></span>}
                      {index >= 3 && <span className="player-rank">{player.rank}</span>}
                    </td>
                    <td>
                      <span className="player-initial">
                        {getInitials(player.username)}
                      </span>
                      {player.username}
                    </td>
                    <td className="column-3">{player.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;