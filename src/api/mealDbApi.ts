import type {
  Ingredient,
  Meal,
  MealDbMeal,
  MealDetailsResponse,
  MealFilterResponse,
  MealSearchResponse,
  MealSummary,
} from "../models/Meal";

import type {
  MealCategory,
  MealCategoryResponse,
} from "../models/MealCategory";

const BASE_URL =
  "https://www.themealdb.com/api/json/v1/1";

function extractIngredients(
  rawMeal: MealDbMeal
): Ingredient[] {
  const ingredients: Ingredient[] = [];

  const rawMealRecord =
    rawMeal as unknown as Record<string, unknown>;

  for (let index = 1; index <= 20; index++) {
    const rawName =
      rawMealRecord[`strIngredient${index}`];

    const rawMeasure =
      rawMealRecord[`strMeasure${index}`];

    const name =
      typeof rawName === "string"
        ? rawName.trim()
        : "";

    const measure =
      typeof rawMeasure === "string"
        ? rawMeasure.trim()
        : "";

    if (name) {
      ingredients.push({
        name,
        measure,
      });
    }
  }

  return ingredients;
}

function normalizeMeal(
  rawMeal: MealDbMeal
): Meal {
  return {
    idMeal: rawMeal.idMeal,
    strMeal: rawMeal.strMeal,
    strMealThumb: rawMeal.strMealThumb,
    strCategory: rawMeal.strCategory,
    strArea: rawMeal.strArea,
    strInstructions:
      rawMeal.strInstructions?.trim() ?? "",
    strYoutube: rawMeal.strYoutube,
    strSource: rawMeal.strSource,
    ingredients: extractIngredients(rawMeal),
  };
}

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
    throw new Error(
      `Meal search failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as MealSearchResponse;

  return data.meals?.map(normalizeMeal) ?? [];
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
      `Meal lookup failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as MealDetailsResponse;

  const rawMeal = data.meals?.[0];

  if (!rawMeal) {
    return null;
  }

  return normalizeMeal(rawMeal);
}

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

export async function filterMealsByIngredient(
  ingredient: string
): Promise<MealSummary[]> {
  const cleanedIngredient = ingredient.trim();

  if (!cleanedIngredient) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(cleanedIngredient)}`
  );

  if (!response.ok) {
    throw new Error(
      `Ingredient filter failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as MealFilterResponse;

  return data.meals ?? [];
}