import AsyncStorage from
  "@react-native-async-storage/async-storage";

import type { MealSummary } from "../models/Meal";

const FAVORITES_KEY = "@meal_planner/favorites";

export async function loadFavorites():
Promise<MealSummary[]> {
  const storedFavorites =
    await AsyncStorage.getItem(FAVORITES_KEY);

  if (!storedFavorites) {
    return [];
  }

  const parsedFavorites: unknown =
    JSON.parse(storedFavorites);

  if (!Array.isArray(parsedFavorites)) {
    return [];
  }

  return parsedFavorites as MealSummary[];
}

export async function saveFavorites(
  favorites: MealSummary[]
): Promise<void> {
  const serializedFavorites =
    JSON.stringify(favorites);

  await AsyncStorage.setItem(
    FAVORITES_KEY,
    serializedFavorites
  );
}