export const API_BASE_URL = 'http://localhost:3000';

export const PARAM_VARIATION = 'variation';

export const COUNTDOWN_TIME = 5;


export enum GameVariationValues {
    SUPER_EASY = 'super_easy',
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export type GameVariation = {
    name: string;       // Name of the variation (e.g., '2x2')
    value: GameVariationValues;      // Unique identifier for the variation (e.g., 'super_easy')
    rows: number;       // Number of rows in the grid
    columns: number;    // Number of columns in the grid
    isVisible: boolean; // Whether the variation is visible or not
};

export const GAME_VARIATIONS: GameVariation[] = [
    {
        name: '2x2',
        value: GameVariationValues.SUPER_EASY,
        rows: 2,
        columns: 2,
        isVisible: true,
    },
    {
        name: '6x6',
        value: GameVariationValues.EASY,
        rows: 6,
        columns: 6,
        isVisible: true,
    },
    {
        name: '8x6',
        value: GameVariationValues.MEDIUM,
        rows: 8,
        columns: 6,
        isVisible: true,
    },
    {
        name: '10x6',
        value: GameVariationValues.HARD,
        rows: 10,
        columns: 6,
        isVisible: true,
    }
]


export interface CardData {
    id: number;
    image: string;
    isFlipped: boolean;
    isMatched: boolean;
    matchedBy?: Player;
    isHinted: boolean;
}

export const GAME_IMAGES = [
    '🐱', '🐶', '🐼', '🦊', '🐸', '🐵', '🐯', '🦁', '🐮', '🐷', '🐔', '🐙',
    '🐻', '🐨', '🐰', '🐹', '🦄', '🐴', '🐢', '🐍', '🐳', '🐬', '🦋', '🐞',
    '🐝', '🦓', '🦒', '🦔', '🦘', '🦜'
];

export interface Player {
    id: string; // Unique identifier for the player
    name: string; // Player's name
    score: number; // Player's score
    time: number; // Time taken by the player
    flips: number; // Number of flips made by the player
    color: string; // Color associated with the player
    matchedPairs: number; // Number of pairs matched by the player
    isCurrentPlayer: boolean; // Indicates if this player is the current player
}

export const PLAYERS: Player[] = [
    { id: 'p1', name: 'Player 1', score: 0, time: 0, flips: 0, color: 'yellow', matchedPairs: 0, isCurrentPlayer: true },
    { id: 'p2', name: 'Player 2', score: 0, time: 0, flips: 0, color: 'green', matchedPairs: 0, isCurrentPlayer: false },
];