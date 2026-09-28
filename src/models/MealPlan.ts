import type { MealSummary } from "./Meal";

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek =
  (typeof DAYS_OF_WEEK)[number];

export const MEAL_SLOTS = [
  "breakfast",
  "lunch",
  "dinner",
] as const;

export type MealSlot =
  (typeof MEAL_SLOTS)[number];

export type DailyMealPlan = Record<
  MealSlot,
  MealSummary | null
>;

export type WeeklyMealPlan = Record<
  DayOfWeek,
  DailyMealPlan
>;

export function createEmptyDailyPlan():
DailyMealPlan {
  return {
    breakfast: null,
    lunch: null,
    dinner: null,
  };
}

export function createEmptyMealPlan():
WeeklyMealPlan {
  return {
    monday: createEmptyDailyPlan(),
    tuesday: createEmptyDailyPlan(),
    wednesday: createEmptyDailyPlan(),
    thursday: createEmptyDailyPlan(),
    friday: createEmptyDailyPlan(),
    saturday: createEmptyDailyPlan(),
    sunday: createEmptyDailyPlan(),
  };
}