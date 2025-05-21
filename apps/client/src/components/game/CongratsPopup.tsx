import React from 'react';
import './CongratsPopup.css';

interface CongratsPopupProps {
  elapsedTime: number;
  flipCount: number;
  score: number | null;
  onPlayAgain: () => void;
  onGoToLeaderboard: () => void;
}

const CongratsPopup: React.FC<CongratsPopupProps> = ({
  elapsedTime,
  flipCount,
  score,
  onPlayAgain,
  onGoToLeaderboard,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You won in {elapsedTime} seconds and used {flipCount} flips!</p>
        {score !== null && <p>Your Score: <strong>{score}</strong></p>}
        <div className="modal-buttons">
          <button onClick={onPlayAgain} className="modal-button play-again">
            Play Again
          </button>
          <button onClick={onGoToLeaderboard} className="modal-button leaderboard">
            Go to Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratsPopup;