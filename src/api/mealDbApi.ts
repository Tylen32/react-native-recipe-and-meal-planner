import type {
  Meal,
  MealDetailsResponse,
  MealFilterResponse,
  MealSearchResponse,
  MealSummary,
} from "../models/Meal";

import type {
  MealCategory,
  MealCategoryResponse,
} from "../models/MealCategory";

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

// Get Meal Category
export async function getMealCategories():
Promise<MealCategory[]> {
  const response = await fetch(
    `${BASE_URL}/categories.php`
  );

  if (!response.ok) {
    throw new Error(
      `Category request failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as MealCategoryResponse;

  return data.categories ?? [];
}

export async function filterMealsByCategory(
  category: string
): Promise<MealSummary[]> {
  const cleanedCategory = category.trim();

  if (!cleanedCategory) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(cleanedCategory)}`
  );

  if (!response.ok) {
    throw new Error(
      `Category filter failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as MealFilterResponse;

  return data.meals ?? [];
}

