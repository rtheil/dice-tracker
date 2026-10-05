import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CurrentGame, SavedGame } from './dice';

const CURRENT_KEY = 'dice-tracker/current/v1';
const SAVED_KEY = 'dice-tracker/saved/v1';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.warn(`Failed to read ${key}`, e);
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write ${key}`, e);
  }
}

export const loadCurrentGame = () => readJson<CurrentGame | null>(CURRENT_KEY, null);
export const storeCurrentGame = (game: CurrentGame) => writeJson(CURRENT_KEY, game);

export const loadSavedGames = () => readJson<SavedGame[]>(SAVED_KEY, []);
export const storeSavedGames = (games: SavedGame[]) => writeJson(SAVED_KEY, games);
