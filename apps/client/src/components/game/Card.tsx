import React from 'react';
import './Card.css';

interface CardProps {
  card: {
    id: number;
    image: string;
    isFlipped: boolean;
    isMatched: boolean;
    isHinted?: boolean;
  };
  onClick: () => void;
  showHints: boolean; // Prop to control hint visibility
}

const Card: React.FC<CardProps> = ({ card, onClick, showHints }) => {
  return (
    <div className={`card-container ${card.isHinted ? 'hinted' : ''}`}>
      {showHints && <div className="card-hint">{card.image}</div>}
      <div
        className={`card ${!card.isFlipped && !card.isMatched ? 'flipped' : ''}`}
        onClick={onClick}
      >
        <div className="card-inner">
          <div className="card-front">{card.image}</div>
          <div className={`card-back ${card.isHinted ? 'highlighted' : ''}`}>❓</div>
        </div>
      </div>
    </div>
  );
};

export default Card;