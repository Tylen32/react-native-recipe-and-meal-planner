import type {
  Meal,
  MealSearchResponse,
} from "../models/Meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMealsByName(
  searchTerm: string
): Promise<Meal[]> {
  const cleanedSearchTerm = searchTerm.trim();

  if (!cleanedSearchTerm) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(cleanedSearchTerm)}`
  );

  if (!response.ok) {
    throw new Error(`Meal search failed: ${response.status}`);
  }

  const data = (await response.json()) as MealSearchResponse;

  return data.meals ?? [];
}