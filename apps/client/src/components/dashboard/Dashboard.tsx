import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './Dashboard.css';
import type { AppDispatch } from '../../store/store';
import { fetchLeaderboardThunk } from '../../services/apiService';
import { GAME_VARIATIONS, GameVariationValues, PARAM_VARIATION } from '../../config/constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from '../../config/utils';
import { FaTrophy, FaUser, FaUsers, FaWifi } from 'react-icons/fa';
import { MdSignalWifiOff } from "react-icons/md";
const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedVariation = (searchParams.get(PARAM_VARIATION) as GameVariationValues) || Utils.getDefaultVariation();
  const [selectedMode, setSelectedMode] = useState("singleplayer");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch leaderboard data
    dispatch(fetchLeaderboardThunk(selectedVariation));

  }, [selectedVariation]);

  const handleVariationChange = (variation: GameVariationValues) => {
    setSearchParams({ variation }); // Update the URL with the selected variation
    dispatch(fetchLeaderboardThunk(variation)); // Fetch leaderboard data for the new variation
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handlePlayNow = () => {
    if (selectedMode === "singleplayer") {
      navigate(`/game?variation=${selectedVariation}`);
    } else {
      navigate(`/multiplayer?variation=${selectedVariation}`);
    }
  };

  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="dashboard-container">
      <button className="leaderboard-button" onClick={handleViewLeaderboard}>
        <FaTrophy className="icon" />
      </button>
      {/* <h2>Welcome, {userName || 'Guest'}!</h2> */}
      <div className="game-options">
        <img
          src="../public/brain_train.png"
          className="brain-train-image"
        />
        {/* <h3 className="variations-title">Select difficulty</h3> */}
        <div className="grouped-buttons">
          {GAME_VARIATIONS.filter(v => v.isVisible).map((variation) => (
            <button
              key={variation.value}
              className={`variation-button ${selectedVariation === variation.value ? "active" : ""
                }`}
              onClick={() => handleVariationChange(variation.value)}
            >
              {variation.name}
            </button>
          ))}
        </div>
        <div className="grouped-buttons">
          <button
            className={`mode-button ${selectedMode === "singleplayer" ? "active" : ""}`}
            onClick={() => handleModeChange("singleplayer")}
            title="Single Player"
          >
            <FaUser className="icon" />
          </button>
          <button
            className={`mode-button ${selectedMode === "multiplayer" ? "active" : ""}`}
            onClick={() => handleModeChange("multiplayer")}
            title="Multiplayer"
          >
            <FaUsers className="icon" />
            <MdSignalWifiOff className="icon" />
          </button>
          <button
            className={`mode-button ${selectedMode === "multiplayer_online" ? "active" : ""}`}
            onClick={() => handleModeChange("multiplayer_online")}
            title="Multiplayer Online"
          >
            <FaUsers className="icon" />
            <FaWifi className="icon" />
          </button>
        </div>
      </div>
      <div className="play-now-container">
        <button className="play-now-button" onClick={handlePlayNow}>
          Play Now
        </button>
      </div>

    </div >
  );
};

export default Dashboard;