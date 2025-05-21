import { GameVariation } from "./constants";

const PLAYER_FB_ID_KEY = 'playerFBId';
const USERNAME_KEY = 'username';

export class Utils {
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

    // Define table layouts for each variation
    static getTableLayout = (variation: GameVariation) => {
        switch (variation) {
            case GameVariation.SUPER_EASY:
                return { rows: 2, cols: 2 }; // 2x2 grid
            case GameVariation.EASY:
                return { rows: 6, cols: 6 }; // 6x6 grid
            case GameVariation.MEDIUM:
                return { rows: 8, cols: 6 }; // 8x6 grid
            case GameVariation.HARD:
                return { rows: 10, cols: 6 }; // 10x6 grid
            default:
                return { rows: 6, cols: 6 }; // Default to easy
        }
    };
}