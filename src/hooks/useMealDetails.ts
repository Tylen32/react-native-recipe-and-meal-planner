import { useEffect, useState } from "react";
import { getMealById } from "../api/mealDbApi";
import type { Meal } from "../models/Meal";

export function useMealDetails(mealId: string) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeal() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getMealById(mealId);

        if (!result) {
          setError("Meal not found.");
          return;
        }

        setMeal(result);
      } catch (error) {
        console.error("Meal lookup failed:", error);
        setError("Unable to load this meal.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMeal();
  }, [mealId]);

  return {
    meal,
    isLoading,
    error,
  };
}