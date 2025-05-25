import React from 'react';
import './CongratsPopupMP.css';

interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface CongratsPopupMPProps {
  players: Player[]; // Array of players
  onPlayAgain: () => void; // Callback for the "Play Again" button
  onGoToDashboard: () => void; // Callback for the "Go to Leaderboard" button
}

const CongratsPopupMP: React.FC<CongratsPopupMPProps> = ({ players, onPlayAgain, onGoToDashboard }) => {
  // Determine the winner
  const winner = players.length > 1
    ? players.reduce((prev, current) => (prev.score > current.score ? prev : current))
    : players[0];

  return (
    <div className="congrats-popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>🎉 Congratulations! 🎉</h2>
        <div className="players-info">
          {players.map((player) => (
            <div key={player.id} className="player-info">
              <span
                className="player-circle"
                style={{ backgroundColor: player.color }}
              ></span>
              <p className="player-name">{player.name}</p>
              <p className="player-score">Score: {player.score}</p>
            </div>
          ))}
        </div>
        <div className="winner-info">
          <h3>🏆 Winner: {winner.name} 🏆</h3>
        </div>
        <div className="popup-buttons">
          <button className="play-again-button" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="dashboard-button" onClick={onGoToDashboard}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratsPopupMP;