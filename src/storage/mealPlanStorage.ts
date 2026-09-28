import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  createEmptyDailyPlan,
  createEmptyMealPlan,
  DAYS_OF_WEEK,
  MEAL_SLOTS,
} from "../models/MealPlan";

import type { MealSummary } from "../models/Meal";

import type {
  DailyMealPlan,
  WeeklyMealPlan,
} from "../models/MealPlan";

const MEAL_PLAN_KEY =
  "@meal_planner/weekly_plan_v2";

function isMealSummary(
  value: unknown
): value is MealSummary {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const meal = value as Record<string, unknown>;

  return (
    typeof meal.idMeal === "string" &&
    typeof meal.strMeal === "string" &&
    typeof meal.strMealThumb === "string"
  );
}

function normalizeDailyPlan(
  value: unknown
): DailyMealPlan {
  const normalizedDay = createEmptyDailyPlan();

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return normalizedDay;
  }

  const storedDay =
    value as Record<string, unknown>;

  for (const slot of MEAL_SLOTS) {
    const storedMeal = storedDay[slot];

    if (
      storedMeal === null ||
      isMealSummary(storedMeal)
    ) {
      normalizedDay[slot] = storedMeal;
    }
  }

  return normalizedDay;
}

function normalizeMealPlan(
  value: unknown
): WeeklyMealPlan {
  const normalizedPlan = createEmptyMealPlan();

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return normalizedPlan;
  }

  const storedPlan =
    value as Record<string, unknown>;

  for (const day of DAYS_OF_WEEK) {
    normalizedPlan[day] =
      normalizeDailyPlan(storedPlan[day]);
  }

  return normalizedPlan;
}

export async function loadMealPlan():
Promise<WeeklyMealPlan> {
  const storedPlan =
    await AsyncStorage.getItem(MEAL_PLAN_KEY);

  if (!storedPlan) {
    return createEmptyMealPlan();
  }

  const parsedPlan: unknown =
    JSON.parse(storedPlan);

  return normalizeMealPlan(parsedPlan);
}

export async function saveMealPlan(
  mealPlan: WeeklyMealPlan
): Promise<void> {
  const serializedPlan =
    JSON.stringify(mealPlan);

  await AsyncStorage.setItem(
    MEAL_PLAN_KEY,
    serializedPlan
  );
}

export async function clearStoredMealPlan():
Promise<void> {
  await AsyncStorage.removeItem(MEAL_PLAN_KEY);
}