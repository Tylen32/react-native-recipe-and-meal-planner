// business logic for search filtering and errors
import { useState } from "react";
import { searchMealsByName } from "../api/mealDbApi";
import type { Meal } from "../models/Meal";

export function useMealSearch() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(searchTerm: string) {
    const cleanedSearchTerm = searchTerm.trim();

    if (!cleanedSearchTerm) {
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      setError(null);

      const results = await searchMealsByName(cleanedSearchTerm);
      setMeals(results);
    } catch (error) {
      console.error("Meal search failed:", error);

      setMeals([]);
      setError("Unable to load meals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    meals,
    isLoading,
    hasSearched,
    error,
    search,
  };
}