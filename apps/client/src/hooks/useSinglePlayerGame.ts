import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { COUNTDOWN_TIME, PARAM_VARIATION, type CardData } from '../config/constants';
import { Utils } from '../config/utils';
import type { AppDispatch } from '../store/store';
import { submitHighScoreThunk, type HighScoreData } from '../services/apiService';
import { getWinnerScore } from '../selectors/leaderboardSelector';

export const useSinglePlayerGame = () => {
  const [searchParams] = useSearchParams();
  const variation = searchParams.get(PARAM_VARIATION) || Utils.getDefaultVariation();

  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_TIME);
  const [showStickyButtons, setShowStickyButtons] = useState<boolean>(false);
  const winnerScore = useSelector(getWinnerScore); // Get winner score from Redux store

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const selectedVariation = Utils.getVariationLayout(variation);
  const totalCards = selectedVariation.rows * selectedVariation.columns;

  // Highlight a pair of unmatched cards
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

  // Handle key press for toggling sticky buttons
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'h') {
        setShowStickyButtons((prev) => !prev);
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

    const flipBackTimeout = setTimeout(() => {
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, isFlipped: false }))
      );
      setIsGameStarted(true);
      setElapsedTime(0);
    }, COUNTDOWN_TIME * 1000);

    return () => clearTimeout(flipBackTimeout);
  }, [totalCards]);

  // Timer to track elapsed time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameStarted && !isGameWon) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameStarted, isGameWon]);

  // Check if all pairs are matched
  useEffect(() => {
    if (matchedPairs === totalCards / 2) {
      setIsGameWon(true);
      setIsGameStarted(false);
    }
  }, [matchedPairs, totalCards]);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) {
      return;
    }

    setFlipCount((prev) => prev + 1);

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
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Toggle hints
  const toggleHints = () => {
    setShowHints((prev) => !prev);
  };

  // Submit game data
  const submitGameData = async () => {
    const userId = Utils.getPlayerFBIdFromLocalStorage();
    const userName = Utils.getUsernameFromLocalStorage();
    if (userId && userName) {
      const data: HighScoreData = {
        player: userName,
        guesses: flipCount,
        timeTakeInSeconds: elapsedTime,
        playerFBId: userId,
        category: variation,
      };

      try {
        await dispatch(submitHighScoreThunk(data)).unwrap();
      } catch (error) {
        console.error('Failed to submit game data:', error);
      }
    }
  };

  // Submit game data when the game is won
  useEffect(() => {
    if (isGameWon) {
      submitGameData();
    }
  }, [isGameWon]);

  // Play again
  const handlePlayAgain = () => {
    window.location.reload();
  };

  // Go to dashboard
  const handleGoToDashboard = () => {
    navigate(`/dashboard?variation=${variation}`);
  };

  return {
    cards,
    flippedCards,
    matchedPairs,
    flipCount,
    showHints,
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
  };
};