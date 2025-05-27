import React from 'react';
import './Multiplayer.css';
import CongratsPopupMP from './CongratsPopupMP';
import { useMultiplayerGame } from '../../hooks/useMultiplayerGame';
import StickyButtons from '../common/StickyButtons';
import GameInfo from '../common/GameInfo';
import CardLayout from '../common/CardLayout';
const MultiPlayer: React.FC = () => {
    const {
        cards,
        showHints,
        isGameStarted,
        isGameWon,
        countdown,
        showStickyButtons,
        players,
        handleCardClick,
        toggleHints,
        handlePlayAgain,
        handleGoToDashboard,
        getWinner,
        highlightHintPair,
        getSelectedPlayer,
        selectedVariation,
        totalCards,
    } = useMultiplayerGame();

    return (

        <div className="multi-player-container">
            {isGameWon && (
                <CongratsPopupMP
                    players={players}
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

                <div className="player-tabs">
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className={`player-details ${getSelectedPlayer().id === player.id ? 'selected' : ''}`}
                        >
                            <div className="tab-content">
                                {getSelectedPlayer() && (
                                    <GameInfo
                                        flips={player.flips}
                                        matchedPairs={player.matchedPairs}
                                        totalPairs={totalCards / 2}
                                        time={player.time}
                                        playerName={player.name} 
                                        playerColor={player.color} 
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isGameWon &&
                (
                    <div className="game-won">
                        <h2>{getWinner()}</h2>
                    </div>
                )}
            <CardLayout
                cards={cards}
                rows={selectedVariation.rows}
                columns={selectedVariation.columns}
                showHints={showHints}
                onCardClick={handleCardClick}
            />
            {/* Sticky buttons */}
            <StickyButtons
                showStickyButtons={showStickyButtons}
                onToggleHints={toggleHints}
                onHighlightHintPair={highlightHintPair}
            />
        </div>
    );
};

export default MultiPlayer;
