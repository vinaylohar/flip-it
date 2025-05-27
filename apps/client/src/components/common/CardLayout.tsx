import React from 'react';
import Card from '../common/Card';
import type { CardData } from '../../config/constants';
import './CardLayout.css';

interface CardLayoutProps {
  cards: CardData[];
  rows: number;
  columns: number;
  showHints: boolean;
  onCardClick: (id: number) => void;
}

const CardLayout: React.FC<CardLayoutProps> = ({ cards, rows, columns, showHints, onCardClick }) => {
  return (
    <div
      className="card-grid"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
          showHints={showHints}
        />
      ))}
    </div>
  );
};

export default CardLayout;