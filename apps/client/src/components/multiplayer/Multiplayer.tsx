import React, { useState, useEffect, useCallback } from 'react';
import './Multiplayer.css';
import { useSearchParams } from 'react-router-dom';
import { Utils } from '../../config/utils';
import { FaLightbulb, FaHighlighter, FaCheckCircle, FaSyncAlt, FaClock } from 'react-icons/fa'; // Import icons
import { PARAM_VARIATION, PLAYERS, type CardData } from '../../config/constants';
import Card from '../common/Card';
import CongratsPopupMP from './CongratsPopupMP';
const MultiPlayer: React.FC = () => {
    const [searchParams] = useSearchParams();
    const variation = searchParams.get(PARAM_VARIATION) as string || Utils.getDefaultVariation()
    const COUNTDOWN_TIME = 5; // Countdown time

    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [totalMatchedPairs, setTotalMatchedPairs] = useState<number>(0);
    const [showHints, setShowHints] = useState<boolean>(false); // State to toggle hints
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false); // Track if the game has started
    const [isGameWon, setIsGameWon] = useState<boolean>(false); // Track if the game is won
    const [countdown, setCountdown] = useState<number>(COUNTDOWN_TIME); // Countdown timer before the game starts
    const [showStickyButtons, setShowStickyButtons] = useState<boolean>(false); // State to toggle sticky buttons
    const [players, setPlayers] = useState(PLAYERS); // Track player data

    const selectedVariation = Utils.getVariationLayout(variation);
    const totalCards = selectedVariation.rows * selectedVariation.columns;

    // Get the current player
    const getSelectedPlayer = useCallback(() => {
        return players.find((player) => player.isCurrentPlayer) || PLAYERS[0];
    }, [players]);

    const highlightHintPair = useCallback(() => {
        // Find the first unmatched pair
        const unmatchedCards = cards.filter((card) => !card.isMatched);
        const hintPair = unmatchedCards.reduce((acc: CardData[], card) => {
            if (acc.length === 2) return acc;  // Stop if we already have a pair
            if (acc.length === 0 || acc[0].image === card.image) acc.push(card); // Add the first card or a matching card
            return acc;
        }, []);

        // Highlight the pair by setting `isHinted` to true
        if (hintPair.length === 2) {
            setCards((prevCards) =>
                prevCards.map((card) =>
                    hintPair.some((hintCard) => hintCard.id === card.id)
                        ? { ...card, isHinted: true }
                        : { ...card, isHinted: false }
                )
            );

            // Remove the highlight after 1 seconds
            setTimeout(() => {
                setCards((prevCards) =>
                    prevCards.map((card) => ({ ...card, isHinted: false }))
                );
            }, 1000);
        }
    }, [cards]);

    // Increment the flip count for the current player
    const incrementFlipCountForSelectedPlayer = useCallback(() => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
                player.id === getSelectedPlayer().id
                    ? { ...player, flips: player.flips + 1 } // Increment the flip count
                    : player
            )
        );
    }, [getSelectedPlayer, setPlayers]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'h') {
                setShowStickyButtons((prev) => !prev); // Toggle sticky buttons on 'h' key press
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    // Initialize cards and start countdown timer
    useEffect(() => {
        const shuffledCards = Utils.initializeCards(totalCards);
        setCards(shuffledCards);
        // Countdown timer before the game starts
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    setCards((prevCards) =>
                        prevCards.map((card) => ({ ...card, isFlipped: false }))
                    );
                    setIsGameStarted(true); // Start the game
                }
                return prev - 1;
            });
        }, 1000);

        // Flip all cards back after 5 seconds
        const flipBackTimeout = setTimeout(() => {
            setCards((prevCards) =>
                prevCards.map((card) => ({ ...card, isFlipped: false }))
            );
            setIsGameStarted(true); // Start the game
            setPlayers(PLAYERS); // Reset players to initial state
        }, COUNTDOWN_TIME * 1000); // Convert seconds to milliseconds

        return () => clearTimeout(flipBackTimeout);
    }, []);

    // Track elapsed time for the current player
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isGameStarted && !isGameWon) {
            // Increment the time for the current player
            timer = setInterval(() => {
                setPlayers((prevPlayers) =>
                    prevPlayers.map((player) =>
                        player.id === getSelectedPlayer().id
                            ? { ...player, time: player.time + 1 }
                            : player
                    )
                );
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer); // Clear the timer when the component unmounts or the player changes
        };
    }, [isGameStarted, isGameWon, getSelectedPlayer]);

    // Check if the game is won
    useEffect(() => {
        if (totalMatchedPairs === (totalCards) / 2) {
            // Calculate score of both players
            const updatedPlayers = players.map((player) => ({
                ...player,
                score: player.matchedPairs * 100 - player.time - (player.flips * 10),
            }));
            setPlayers(updatedPlayers);

            setIsGameWon(true);
            setIsGameStarted(false); // Stop the timer
        }
    }, [totalMatchedPairs, totalCards]);

    const handleCardClick = (id: number) => {
        // Prevent flipping more than two cards at a time
        // and prevent flipping already matched or flipped cards
        if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) {
            return;
        }

        incrementFlipCountForSelectedPlayer();

        const newFlippedCards = [...flippedCards, id];
        const newCards = cards.map((card, index) =>
            index === id ? { ...card, isFlipped: true } : card
        );

        setCards(newCards);
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            const [firstId, secondId] = newFlippedCards;
            if (cards[firstId].image === cards[secondId].image) {
                setTimeout(() => {
                    setCards((prevCards) =>
                        prevCards.map((card) =>
                            card.image === cards[firstId].image
                                ? { ...card, isMatched: true, matchedBy: getSelectedPlayer() }
                                : card
                        )
                    );
                    setTotalMatchedPairs((prev) => prev + 1);
                    setFlippedCards([]);
                }, 1000);
                // Match found, update the matched pairs and reset flipped cards
                const updatedPlayers = players.map((player) =>
                    player.id === getSelectedPlayer().id
                        ? { ...player, matchedPairs: player.matchedPairs + 1 }
                        : player
                );
                setPlayers(updatedPlayers);
            } else {

                // No match found, switch to the next player
                setTimeout(() => {
                    setFlippedCards([]);
                    // Switch to the next player
                    setPlayers((prevPlayers) =>
                        prevPlayers.map((player) =>
                            player.id === getSelectedPlayer().id
                                ? { ...player, isCurrentPlayer: false }
                                : { ...player, isCurrentPlayer: true }
                        )
                    );

                    // Reset the flipped cards after a delay
                    setCards((prevCards) =>
                        prevCards.map((card) =>
                            card.id === firstId || card.id === secondId
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                }, 1000);
            }
        }


    };

    const toggleHints = () => {
        setShowHints((prev) => !prev);
    };

    const handlePlayAgain = () => {
        window.location.reload();
    };

    // Function to go to dashboard 
    const handleGoToDashboard = () => {
        window.location.href = '/dashboard'; 
    };

    // Function for player who has won
    const getWinner = () => {
        const winner = players.reduce((prev, current) => (prev.score > current.score ? prev : current));
        return winner ? `${winner.name} has won!` : 'No winner yet';
    };

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
                                    <div className="game-info">
                                        <h3>
                                            <span
                                                className="player-circle"
                                                style={{ backgroundColor: player.color }}
                                            ></span>
                                            {player.name}
                                        </h3>
                                        <div className="info-item">
                                            <FaSyncAlt className="info-icon" title="Flips" />
                                            <span className="info-value">{player.flips}</span>
                                        </div>
                                        <div className="info-item">
                                            <FaCheckCircle className="info-icon" title="Flips" />
                                            <span className="info-value">{player.matchedPairs + '/' + totalCards / 2}</span>
                                        </div>
                                        <div className="info-item">
                                            <FaClock className="info-icon" title="Time" />
                                            <span className="info-value">{player.time} s</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>


            )}
            {/* Sticky buttons */}
            {showStickyButtons && (
                <div className="sticky-buttons">
                    <button className="icon-button" onClick={toggleHints} title="Show Hints">
                        <FaLightbulb />
                    </button>
                    <button
                        className="icon-button"
                        onClick={highlightHintPair}
                        title="Highlight a Pair"
                    >
                        <FaHighlighter />
                    </button>
                </div>
            )}
            {isGameWon &&
                (
                    <div className="game-won">
                        <h2>{getWinner()}</h2>
                    </div>
                )}
            <div
                className="card-grid"
                style={{
                    gridTemplateRows: `repeat(${selectedVariation.rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${selectedVariation.columns}, 1fr)`,
                }}
            >
                {cards.map((card) => (

                    <Card
                        key={card.id}
                        card={card}
                        onClick={() => {
                            handleCardClick(card.id)
                        }}

                        showHints={showHints}
                    />

                ))}
            </div>
        </div>
    );
};

export default MultiPlayer;
