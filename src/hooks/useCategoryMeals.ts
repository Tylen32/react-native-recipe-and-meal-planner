import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  filterMealsByCategory,
} from "../api/mealDbApi";

import type {
  MealSummary,
} from "../models/Meal";

export function useCategoryMeals(
  category: string
) {
  const [meals, setMeals] = useState<
    MealSummary[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const requestIdRef = useRef(0);

  const loadCategoryMeals = useCallback(
    async (): Promise<void> => {
      const cleanedCategory = category.trim();

      if (!cleanedCategory) {
        setMeals([]);
        setError("A category is required.");
        setIsLoading(false);
        return;
      }

      const requestId = ++requestIdRef.current;

      try {
        setIsLoading(true);
        setError(null);

        const results =
          await filterMealsByCategory(
            cleanedCategory
          );

        if (
          requestId === requestIdRef.current
        ) {
          setMeals(results);
        }
      } catch (caughtError) {
        console.error(
          `Failed to load ${cleanedCategory} meals:`,
          caughtError
        );

        if (
          requestId === requestIdRef.current
        ) {
          setMeals([]);
          setError(
            `Unable to load ${cleanedCategory} meals.`
          );
        }
      } finally {
        if (
          requestId === requestIdRef.current
        ) {
          setIsLoading(false);
        }
      }
    },
    [category]
  );

  useEffect(() => {
    void loadCategoryMeals();

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadCategoryMeals]);

  return {
    meals,
    isLoading,
    error,
    reloadCategoryMeals: loadCategoryMeals,
  };
}