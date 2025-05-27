import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COUNTDOWN_TIME, PARAM_VARIATION, PLAYERS, type CardData } from '../config/constants';
import { Utils } from '../config/utils';

export const useMultiplayerGame = () => {
    const [searchParams] = useSearchParams();
    const variation = searchParams.get(PARAM_VARIATION) as string || Utils.getDefaultVariation();

    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [totalMatchedPairs, setTotalMatchedPairs] = useState<number>(0);
    const [showHints, setShowHints] = useState<boolean>(false);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [isGameWon, setIsGameWon] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(COUNTDOWN_TIME);
    const [showStickyButtons, setShowStickyButtons] = useState<boolean>(false);
    const [players, setPlayers] = useState(PLAYERS);

    const selectedVariation = Utils.getVariationLayout(variation);
    const totalCards = selectedVariation.rows * selectedVariation.columns;

    // Get the current player
    const getSelectedPlayer = useCallback(() => {
        return players.find((player) => player.isCurrentPlayer) || PLAYERS[0];
    }, [players]);

    // Highlight unmatched card pairs
    const highlightHintPair = useCallback(() => {
        const unmatchedCards = cards.filter((card) => !card.isMatched);
        const hintPair = unmatchedCards.reduce((acc: CardData[], card) => {
            if (acc.length === 2) return acc;
            if (acc.length === 0 || acc[0].image === card.image) acc.push(card);
            return acc;
        }, []);

        if (hintPair.length === 2) {
            setCards((prevCards) =>
                prevCards.map((card) =>
                    hintPair.some((hintCard) => hintCard.id === card.id)
                        ? { ...card, isHinted: true }
                        : { ...card, isHinted: false }
                )
            );

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
                    ? { ...player, flips: player.flips + 1 }
                    : player
            )
        );
    }, [getSelectedPlayer]);

    // Handle card click logic
    const handleCardClick = useCallback(
        (id: number) => {
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

                    setPlayers((prevPlayers) =>
                        prevPlayers.map((player) =>
                            player.id === getSelectedPlayer().id
                                ? { ...player, matchedPairs: player.matchedPairs + 1 }
                                : player
                        )
                    );
                } else {
                    setTimeout(() => {
                        setFlippedCards([]);
                        setPlayers((prevPlayers) =>
                            prevPlayers.map((player) =>
                                player.id === getSelectedPlayer().id
                                    ? { ...player, isCurrentPlayer: false }
                                    : { ...player, isCurrentPlayer: true }
                            )
                        );

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
        },
        [cards, flippedCards, incrementFlipCountForSelectedPlayer, getSelectedPlayer]
    );

    // Toggle hints
    const toggleHints = useCallback(() => {
        setShowHints((prev) => !prev);
    }, []);

    // Restart the game
    const handlePlayAgain = useCallback(() => {
        window.location.reload();
    }, []);

    // Navigate to the dashboard
    const handleGoToDashboard = useCallback(() => {
        window.location.href = '/dashboard';
    }, []);

    // Determine the winner
    const getWinner = useCallback(() => {
        const winner = players.reduce((prev, current) =>
            prev.score > current.score ? prev : current
        );
        return winner ? `${winner.name} has won!` : 'No winner yet';
    }, [players]);

    // Initialize cards and start countdown
    useEffect(() => {
        const shuffledCards = Utils.initializeCards(totalCards);
        setCards(shuffledCards);

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    setCards((prevCards) =>
                        prevCards.map((card) => ({ ...card, isFlipped: false }))
                    );
                    setIsGameStarted(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [totalCards]);

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

    // Track elapsed time for the current player
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isGameStarted && !isGameWon) {
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
            if (timer) clearInterval(timer);
        };
    }, [isGameStarted, isGameWon, getSelectedPlayer]);

    // Check if the game is won
    useEffect(() => {
        if (totalMatchedPairs === totalCards / 2 && !isGameWon) {
            const updatedPlayers = players.map((player) => ({
                ...player,
                score: player.matchedPairs * 1000 - player.time - player.flips * 10,
            }));
            setPlayers(updatedPlayers);

            setIsGameWon(true);
            setIsGameStarted(false);
        }
    }, [totalMatchedPairs, totalCards, players]);

    return {
        cards,
        flippedCards,
        totalMatchedPairs,
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
    };
};