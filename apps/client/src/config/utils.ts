import { GAME_IMAGES, GAME_VARIATIONS, GameVariationValues, type CardData, type GameVariation } from "./constants";

const PLAYER_FB_ID_KEY = 'playerFBId';
const USERNAME_KEY = 'username';

export class Utils {
    static getVariationName(selectedVariation: GameVariationValues) {
        return GAME_VARIATIONS.find(v => v.value === selectedVariation)?.name || '';
    }
    /**
     * Get the playerFBId from localStorage
     */
    static getPlayerFBIdFromLocalStorage(): string | null {
        return localStorage.getItem(PLAYER_FB_ID_KEY);
    }

    /**
     * Set the playerFBId in localStorage
     */
    static setPlayerFBIdInLocalStorage(playerFBId: string): void {
        localStorage.setItem(PLAYER_FB_ID_KEY, playerFBId);
    }

    /**
     * Remove the playerFBId from localStorage
     */
    static clearPlayerFBIdFromLocalStorage(): void {
        localStorage.removeItem(PLAYER_FB_ID_KEY);
    }

    /**
     * Get the username from localStorage
     */
    static getUsernameFromLocalStorage(): string | null {
        return localStorage.getItem(USERNAME_KEY);
    }

    /**
     * Set the username in localStorage
     */
    static setUsernameInLocalStorage(username: string): void {
        localStorage.setItem(USERNAME_KEY, username);
    }

    /**
     * Remove the username from localStorage
     */
    static clearUsernameFromLocalStorage(): void {
        localStorage.removeItem(USERNAME_KEY);
    }

    /**
     * Clear all user-related data from localStorage (e.g., on logout or session timeout)
     */
    static clearUserSessionFromLocalStorage(): void {
        Utils.clearPlayerFBIdFromLocalStorage();
        Utils.clearUsernameFromLocalStorage();
    }

    /**
   * Get the visible game variations
   */
    static getVisibleGameVariations(): Array<GameVariation> {
        return GAME_VARIATIONS.filter(v => v.isVisible);
    }

    /**
     * Get the default game variation based on visibility
     */
    static getDefaultVariation(): string {
        return GAME_VARIATIONS.find(v => v.isVisible)?.value || '';
    }

    /**
     * Get the default game variation based on visibility
     */
    static getVariationLayout(variation: string): GameVariation {
        return GAME_VARIATIONS.find(v => v.isVisible && v.value === variation) || Utils.getVisibleGameVariations()[0];
    }

    static shuffleArray = (array: any[]): any[] => {
        return array.sort(() => Math.random() - 0.5);
    };

    static initializeCards = (totalCards: number): CardData[] => {
        const uniqueCards = Math.floor(totalCards / 2);
        const imagesToUse = GAME_IMAGES.slice(0, uniqueCards);

        // Shuffle and slice the images array to match the total cards
        const shuffledCards = Utils.shuffleArray([...imagesToUse, ...imagesToUse])
            .slice(0, totalCards)
            .map((image, index) => ({
                id: index,
                image,
                isFlipped: true, // Initially, all cards are flipped
                isMatched: false,
                isHinted: false, // Add the missing isHinted property
            }));

        return shuffledCards;
    };
}