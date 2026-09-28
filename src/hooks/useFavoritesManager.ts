import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  loadFavorites,
  saveFavorites,
} from "../storage/favoritesStorage";

import type { MealSummary } from "../models/Meal";

export function useFavoritesManager() {
  const [favorites, setFavorites] = useState<
    MealSummary[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const favoritesRef = useRef<MealSummary[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function initializeFavorites() {
      try {
        setIsLoading(true);
        setError(null);

        const savedFavorites =
          await loadFavorites();

        if (isMounted) {
          favoritesRef.current = savedFavorites;
          setFavorites(savedFavorites);
        }
      } catch (caughtError) {
        console.error(
          "Failed to load favorites:",
          caughtError
        );

        if (isMounted) {
          setError("Unable to load favorites.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateFavorites = useCallback(
    async (
      updatedFavorites: MealSummary[]
    ): Promise<boolean> => {
      try {
        setError(null);

        await saveFavorites(updatedFavorites);

        favoritesRef.current = updatedFavorites;
        setFavorites(updatedFavorites);

        return true;
      } catch (caughtError) {
        console.error(
          "Failed to save favorites:",
          caughtError
        );

        setError("Unable to save favorites.");

        return false;
      }
    },
    []
  );

  const isFavorite = useCallback(
    (mealId: string): boolean => {
      return favorites.some(
        (meal) => meal.idMeal === mealId
      );
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (meal: MealSummary): Promise<void> => {
      const currentFavorites =
        favoritesRef.current;

      const alreadyExists = currentFavorites.some(
        (favorite) =>
          favorite.idMeal === meal.idMeal
      );

      if (alreadyExists) {
        return;
      }

      const updatedFavorites = [
        ...currentFavorites,
        meal,
      ];

      await updateFavorites(updatedFavorites);
    },
    [updateFavorites]
  );

  const removeFavorite = useCallback(
    async (mealId: string): Promise<void> => {
      const currentFavorites =
        favoritesRef.current;

      const updatedFavorites =
        currentFavorites.filter(
          (meal) => meal.idMeal !== mealId
        );

      if (
        updatedFavorites.length ===
        currentFavorites.length
      ) {
        return;
      }

      await updateFavorites(updatedFavorites);
    },
    [updateFavorites]
  );

  const toggleFavorite = useCallback(
    async (meal: MealSummary): Promise<void> => {
      const currentFavorites =
        favoritesRef.current;

      const currentlyFavorite =
        currentFavorites.some(
          (favorite) =>
            favorite.idMeal === meal.idMeal
        );

      const updatedFavorites = currentlyFavorite
        ? currentFavorites.filter(
            (favorite) =>
              favorite.idMeal !== meal.idMeal
          )
        : [...currentFavorites, meal];

      await updateFavorites(updatedFavorites);
    },
    [updateFavorites]
  );

  return {
    favorites,
    isLoading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}