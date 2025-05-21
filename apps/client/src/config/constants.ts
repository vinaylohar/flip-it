export const API_BASE_URL = 'http://localhost:3000';

export enum GameVariation {
    SUPER_EASY = 'super_easy',
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export const PARAM_VARIATION = 'variation';

// Create GameVariationLayout enum based on GameVariation
export enum GameVariationLayout {
    SUPER_EASY = '2x2', // 2 rows x 2 columns
    EASY = '6x6', // 6 rows x 6 columns
    MEDIUM = '8x6', // 8 rows x 6 columns
    HARD = '10x6', // 10 rows x 6 columns
}

// Utility function to map GameVariation to GameVariationLayout
export const getGameVariationLayout = (variation: GameVariation): string => {
    return GameVariationLayout[variation.toUpperCase() as keyof typeof GameVariationLayout];
};
 
// Utility function to map GameVariationLayout to GameVariation
export const getGameVariationFromLayout = (layout: string): GameVariation => {
    const variationKey = Object.keys(GameVariationLayout).find(key => GameVariationLayout[key as keyof typeof GameVariationLayout] === layout);
    return variationKey ? GameVariation[variationKey as keyof typeof GameVariation] : GameVariation.EASY;
};
