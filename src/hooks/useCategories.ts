import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getMealCategories,
} from "../api/mealDbApi";

import type {
  MealCategory,
} from "../models/MealCategory";

export function useCategories() {
  const [categories, setCategories] = useState<
    MealCategory[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const isMountedRef = useRef(true);

  const loadCategories = useCallback(
    async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const results =
          await getMealCategories();

        if (isMountedRef.current) {
          setCategories(results);
        }
      } catch (caughtError) {
        console.error(
          "Failed to load categories:",
          caughtError
        );

        if (isMountedRef.current) {
          setError(
            "Unable to load meal categories."
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    isMountedRef.current = true;

    void loadCategories();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
    reloadCategories: loadCategories,
  };
}