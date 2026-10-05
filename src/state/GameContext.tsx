import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { CurrentGame, SavedGame } from '@/lib/dice';
import { loadCurrentGame, loadSavedGames, storeCurrentGame, storeSavedGames } from '@/lib/storage';

type GameStore = {
  loaded: boolean;
  current: CurrentGame;
  saved: SavedGame[];
  addRoll: (value: number) => void;
  undoLastRoll: () => void;
  saveAndStartNew: (name: string) => void;
  discardCurrent: () => void;
  deleteSaved: (id: string) => void;
};

const GameContext = createContext<GameStore | null>(null);

const newGame = (): CurrentGame => ({ createdAt: Date.now(), rolls: [] });

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function GameProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState<CurrentGame>(newGame);
  const [saved, setSaved] = useState<SavedGame[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadCurrentGame(), loadSavedGames()]).then(([storedCurrent, storedSaved]) => {
      if (cancelled) return;
      if (storedCurrent) setCurrent(storedCurrent);
      setSaved(storedSaved);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The game in progress is written on every change so closing the app never loses rolls.
  useEffect(() => {
    if (loaded) storeCurrentGame(current);
  }, [current, loaded]);

  useEffect(() => {
    if (loaded) storeSavedGames(saved);
  }, [saved, loaded]);

  const addRoll = useCallback((value: number) => {
    setCurrent((g) => ({ ...g, rolls: [...g.rolls, { value, at: Date.now() }] }));
  }, []);

  const undoLastRoll = useCallback(() => {
    setCurrent((g) => ({ ...g, rolls: g.rolls.slice(0, -1) }));
  }, []);

  const saveAndStartNew = useCallback(
    (name: string) => {
      const { rolls, createdAt } = current;
      const game: SavedGame = {
        id: newId(),
        name: name.trim() || 'Untitled game',
        startedAt: rolls[0]?.at ?? createdAt,
        endedAt: rolls[rolls.length - 1]?.at ?? Date.now(),
        rolls,
      };
      setSaved((list) => [game, ...list]);
      setCurrent(newGame());
    },
    [current],
  );

  const discardCurrent = useCallback(() => setCurrent(newGame()), []);

  const deleteSaved = useCallback((id: string) => {
    setSaved((list) => list.filter((g) => g.id !== id));
  }, []);

  const value = useMemo(
    () => ({ loaded, current, saved, addRoll, undoLastRoll, saveAndStartNew, discardCurrent, deleteSaved }),
    [loaded, current, saved, addRoll, undoLastRoll, saveAndStartNew, discardCurrent, deleteSaved],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameStore {
  const store = useContext(GameContext);
  if (!store) throw new Error('useGame must be used inside <GameProvider>');
  return store;
}
