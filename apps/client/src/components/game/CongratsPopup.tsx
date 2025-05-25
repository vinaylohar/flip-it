import React from 'react';
import './CongratsPopup.css';

interface CongratsPopupProps {
  elapsedTime: number;
  flipCount: number;
  score: number | null;
  onPlayAgain: () => void;
  onGoToDashboard: () => void;
}

const CongratsPopup: React.FC<CongratsPopupProps> = ({
  elapsedTime,
  flipCount,
  score,
  onPlayAgain,
  onGoToDashboard,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You won in {elapsedTime} seconds and used {flipCount} flips!</p>
        {score !== null && <p>Your Score: <strong>{score}</strong></p>}
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

export default CongratsPopup;