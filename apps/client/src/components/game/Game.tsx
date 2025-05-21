import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import './Game.css';
import { GameVariation, getGameVariationLayout, PARAM_VARIATION } from '../../config/constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from '../../config/utils';
import { FaLightbulb, FaHighlighter, FaThLarge, FaCheckCircle, FaSyncAlt, FaClock } from 'react-icons/fa'; // Import icons
import CongratsPopup from './CongratsPopup';
import { submitHighScoreThunk, type HighScoreData } from '../../services/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { getWinnerScore } from '../../selectors/leaderboardSelector';
import type { AppDispatch } from '../../store/store';

interface CardData {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const images = [
  '🐱', '🐶', '🐼', '🦊', '🐸', '🐵', '🐯', '🦁', '🐮', '🐷', '🐔', '🐙',
  '🐻', '🐨', '🐰', '🐹', '🦄', '🐴', '🐢', '🐍', '🐳', '🐬', '🦋', '🐞',
  '🐝', '🦓', '🦒', '🦔', '🦘', '🦜'
];

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const Game: React.FC = () => {
  const [searchParams] = useSearchParams();
  const variation = searchParams.get(PARAM_VARIATION) as GameVariation || GameVariation.EASY;
  const COUNTDOWN_TIME = 5; // Countdown time

  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false); // State to toggle hints
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Timer to track elapsed time
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false); // Track if the game has started
  const [isGameWon, setIsGameWon] = useState<boolean>(false); // Track if the game is won
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_TIME); // Countdown timer before the game starts
  const [showStickyButtons, setShowStickyButtons] = useState<boolean>(false); // State to toggle sticky buttons
  const navigate = useNavigate(); // Initialize the navigate function
  const winnerScore = useSelector(getWinnerScore); // Get winner score from Redux store
  const dispatch = useDispatch<AppDispatch>();

  const { rows, cols } = Utils.getTableLayout(variation);
  const totalCards = rows * cols;

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

  useEffect(() => {
    const uniqueCards = Math.floor(totalCards / 2);
    const imagesToUse = images.slice(0, uniqueCards);
    // Shuffle and slice the images array to match the total cards
    const shuffledCards = shuffleArray([...imagesToUse, ...imagesToUse])
      .slice(0, totalCards)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: true, // Initially, all cards are flipped
        isMatched: false,
      }));

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
      setElapsedTime(0); // Reset elapsed time
    }, COUNTDOWN_TIME * 1000); // Convert seconds to milliseconds

    return () => clearTimeout(flipBackTimeout);
  }, []);

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

  useEffect(() => {
    // Check if all pairs are matched
    if (matchedPairs === (totalCards) / 2) {
      setIsGameWon(true);
      setIsGameStarted(false); // Stop the timer
    }
  }, [matchedPairs, totalCards]);

  const handleCardClick = (id: number) => {
    // Prevent flipping more than two cards at a time
    // and prevent flipping already matched or flipped cards
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

  const toggleHints = () => {
    setShowHints((prev) => !prev);
  };

  useEffect(() => {
    if (isGameWon) {
      // Push the game data to the backend
      submitGameData();
    }
  }, [isGameWon]);

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

  const handlePlayAgain = () => {
    // Navigate to the game page to re-render
    window.location.reload();
    // navigate(`/game?variation=${variation}`);
  };

  const handleGoToLeaderboard = () => {
    navigate(`/dashboard?variation=${variation}`); // Navigate to the leaderboard/dashboard
  };


  return (

    <div className="game-container">
      {isGameWon && (
        <CongratsPopup
          elapsedTime={elapsedTime}
          flipCount={flipCount}
          score={winnerScore}
          onPlayAgain={handlePlayAgain}
          onGoToLeaderboard={handleGoToLeaderboard}
        />
      )}
      {!isGameStarted && !isGameWon && (
        <div className="countdown">
          <p>Game starts in: {countdown}</p>
        </div>
      )}  
      {isGameStarted && (
        <div className="game-info">
          <div className="info-item">
            <FaThLarge className="info-icon" title="Variation" />
            <span className="info-value">{getGameVariationLayout(variation)}</span>
          </div>
          <div className="info-item">
            <FaCheckCircle className="info-icon" title="Paired" />
            <span className="info-value">{matchedPairs + '/' + totalCards / 2}</span>
          </div>
          <div className="info-item">
            <FaSyncAlt className="info-icon" title="Flips" />
            <span className="info-value">{flipCount}</span>
          </div>
          <div className="info-item">
            <FaClock className="info-icon" title="Time" />
            <span className="info-value">{elapsedTime} s</span>
          </div>
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
      {isGameWon && (
        <div className="game-won">
          <h2>You won {getGameVariationLayout(variation)} in {elapsedTime} seconds & used {flipCount} flips!</h2>
        </div>
      )}
      <div
        className="card-grid"
        style={{
          gridTemplateRows: `repeat(${Utils.getTableLayout(variation).rows}, 1fr)`,
          gridTemplateColumns: `repeat(${Utils.getTableLayout(variation).cols}, 1fr)`,
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

export default Game;
