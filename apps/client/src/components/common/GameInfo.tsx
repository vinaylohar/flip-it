import React from 'react';
import { FaSyncAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import './GameInfo.css';

interface GameInfoProps {
  flips: number;
  matchedPairs: number;
  totalPairs: number;
  time: number;
  playerName?: string; // Optional player name
  playerColor?: string; // Optional player color
}

const GameInfo: React.FC<GameInfoProps> = ({
  flips,
  matchedPairs,
  totalPairs,
  time,
  playerName,
  playerColor,
}) => {
  return (
    <div className="game-info">
      {/* Conditionally render player name and color */}
      {playerName && (
        <h3>
          <span
            className="player-circle"
            style={{ backgroundColor: playerColor || 'transparent' }}
          ></span>
          {playerName}
        </h3>
      )}
      <div className="info-item">
        <FaSyncAlt className="info-icon" title="Flips" />
        <span className="info-value">{flips}</span>
      </div>
      <div className="info-item">
        <FaCheckCircle className="info-icon" title="Matched Pairs" />
        <span className="info-value">{matchedPairs}/{totalPairs}</span>
      </div>
      <div className="info-item">
        <FaClock className="info-icon" title="Time" />
        <span className="info-value">{time} s</span>
      </div>
    </div>
  );
};

export default GameInfo;