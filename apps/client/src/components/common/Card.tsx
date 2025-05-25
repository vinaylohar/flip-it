import React from 'react';
import './Card.css';
import { PLAYERS, type CardData } from '../../config/constants';

interface CardProps {
  card: CardData;
  onClick: () => void;
  showHints: boolean; // Prop to control hint visibility
}

const Card: React.FC<CardProps> = ({ card, onClick, showHints }) => {
  return (
    <div className={`card-container ${card.isHinted ? 'hinted' : ''}`}
    >
      {showHints && <div className="card-hint">{card.image}</div>}
      <div
        className={`card ${!card.isFlipped && !card.isMatched ? 'flipped' : ''}`}
        onClick={onClick}
      >
        <div className="card-inner">
          <div className="card-front"
          style={{
            backgroundColor: card.isMatched && card.matchedBy ? PLAYERS.find((p) => p.id === card.matchedBy?.id)?.color : '#ccc',
          }}
          >{card.image}</div>
          <div className={`card-back ${card.isHinted ? 'highlighted' : ''}`}>❓</div>
        </div>
      </div>
    </div>
  );
};

export default Card;