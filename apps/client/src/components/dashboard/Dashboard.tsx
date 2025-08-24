import React, { useState } from 'react';
import './Dashboard.css';
import { GAME_VARIATIONS, GameVariationValues, PARAM_VARIATION } from '../../config/constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from '../../config/utils';
import { FaTrophy, FaUser, FaUsers, FaWifi } from 'react-icons/fa';
import { MdSignalWifiOff } from "react-icons/md";
const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Get the current search parameters from the URL
  const selectedVariation = (searchParams.get(PARAM_VARIATION) as GameVariationValues) || Utils.getDefaultVariation(); // Get the selected variation from the URL or use the default variation
  const [selectedMode, setSelectedMode] = useState("singleplayer");

  const navigate = useNavigate();

  const handleVariationChange = (variation: GameVariationValues) => {
    setSearchParams({ variation }); // Update the URL with the selected variation
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
      <div className="game-options">
        <img
          src="../flip-it/brain_train.png"
          className="brain-train-image"
        />
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
            title="Multiplayer Online (Coming Soon)"
            disabled={true}
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