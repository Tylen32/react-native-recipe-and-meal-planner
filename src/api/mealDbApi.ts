import type {
  Meal,
  MealSearchResponse,
  MealDetailsResponse
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

export async function getMealById(
  mealId: string
): Promise<Meal | null> {
  const cleanedMealId = mealId.trim();

  if (!cleanedMealId) {
    return null;
  }

  const response = await fetch(
    `${BASE_URL}/lookup.php?i=${encodeURIComponent(cleanedMealId)}`
  );

  if (!response.ok) {
    throw new Error(
      `Meal lookup failed with status ${response.status}`
    );
  }

  const data =
    (await response.json()) as MealDetailsResponse;

  return data.meals?.[0] ?? null;
}