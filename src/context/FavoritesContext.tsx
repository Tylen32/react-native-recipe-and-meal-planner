import {
  createContext,
  useContext,
} from "react";

import { useFavoritesManager } from
  "../hooks/useFavoritesManager";

import type { PropsWithChildren } from "react";

type FavoritesContextValue =
  ReturnType<typeof useFavoritesManager>;

const FavoritesContext =
  createContext<FavoritesContextValue | undefined>(
    undefined
  );

export function FavoritesProvider({
  children,
}: PropsWithChildren) {
  const favoritesManager =
    useFavoritesManager();

  return (
    <FavoritesContext.Provider
      value={favoritesManager}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider"
    );
  }

  return context;
}