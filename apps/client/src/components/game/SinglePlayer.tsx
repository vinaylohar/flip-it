import React, {  } from 'react';
import './SinglePlayer.css';
import CongratsPopup from './CongratsPopup';
import StickyButtons from '../common/StickyButtons';
import CardLayout from '../common/CardLayout';
import GameInfo from '../common/GameInfo';
import { useSinglePlayerGame } from '../../hooks/useSinglePlayerGame';



const SinglePlayer: React.FC = () => {

    const {
    cards,
    flipCount,
    matchedPairs,
    elapsedTime,
    isGameStarted,
    isGameWon,
    countdown,
    showStickyButtons,
    handleCardClick,
    toggleHints,
    handlePlayAgain,
    handleGoToDashboard,
    highlightHintPair,
    selectedVariation,
    totalCards,
    winnerScore,
    showHints,
  } = useSinglePlayerGame();

  return (
    <div className="single-player-container">
      {isGameWon && (
        <CongratsPopup
          elapsedTime={elapsedTime}
          flipCount={flipCount}
          score={winnerScore}
          onPlayAgain={handlePlayAgain}
          onGoToDashboard={handleGoToDashboard}
        />
      )}
      {!isGameStarted && !isGameWon && (
        <div className="countdown">
          <p>Game starts in: {countdown}</p>
        </div>
      )}
      {isGameStarted && (
        <GameInfo
          flips={flipCount}
          matchedPairs={matchedPairs}
          totalPairs={totalCards / 2}
          time={elapsedTime}
        />
      )}
      {isGameWon && (
        <div className="game-won">
          <h2>You won {selectedVariation.name} in {elapsedTime} seconds & used {flipCount} flips!</h2>
        </div>
      )}
      <CardLayout
        cards={cards}
        rows={selectedVariation.rows}
        columns={selectedVariation.columns}
        showHints={showHints}
        onCardClick={handleCardClick}
      />
      {/* Sticky hint buttons */}
      <StickyButtons
        showStickyButtons={showStickyButtons}
        onToggleHints={toggleHints}
        onHighlightHintPair={highlightHintPair}
      />
    </div>
  );
};

export default SinglePlayer;
