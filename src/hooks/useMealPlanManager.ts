import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  clearStoredMealPlan,
  loadMealPlan,
  saveMealPlan,
} from "../storage/mealPlanStorage";

import {
  createEmptyMealPlan,
} from "../models/MealPlan";

import type { MealSummary } from "../models/Meal";

import type {
  DayOfWeek,
  MealSlot,
  WeeklyMealPlan,
} from "../models/MealPlan";

export function useMealPlanManager() {
  const [mealPlan, setMealPlan] =
    useState<WeeklyMealPlan>(
      createEmptyMealPlan
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const mealPlanRef = useRef<WeeklyMealPlan>(
    createEmptyMealPlan()
  );

  useEffect(() => {
    let isMounted = true;

    async function initializeMealPlan() {
      try {
        setIsLoading(true);
        setError(null);

        const savedPlan = await loadMealPlan();

        if (isMounted) {
          mealPlanRef.current = savedPlan;
          setMealPlan(savedPlan);
        }
      } catch (caughtError) {
        console.error(
          "Failed to load meal plan:",
          caughtError
        );

        if (isMounted) {
          setError(
            "Unable to load the weekly meal plan."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeMealPlan();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateMealPlan = useCallback(
    async (
      updatedPlan: WeeklyMealPlan
    ): Promise<boolean> => {
      try {
        setError(null);

        await saveMealPlan(updatedPlan);

        mealPlanRef.current = updatedPlan;
        setMealPlan(updatedPlan);

        return true;
      } catch (caughtError) {
        console.error(
          "Failed to save meal plan:",
          caughtError
        );

        setError(
          "Unable to save the weekly meal plan."
        );

        return false;
      }
    },
    []
  );

  const getMealForSlot = useCallback(
    (
      day: DayOfWeek,
      slot: MealSlot
    ): MealSummary | null => {
      return mealPlan[day][slot];
    },
    [mealPlan]
  );

  const isSlotOccupied = useCallback(
    (
      day: DayOfWeek,
      slot: MealSlot
    ): boolean => {
      return mealPlan[day][slot] !== null;
    },
    [mealPlan]
  );

  const setMealForSlot = useCallback(
    async (
      day: DayOfWeek,
      slot: MealSlot,
      meal: MealSummary
    ): Promise<void> => {
      const currentPlan = mealPlanRef.current;

      const updatedPlan: WeeklyMealPlan = {
        ...currentPlan,

        [day]: {
          ...currentPlan[day],
          [slot]: meal,
        },
      };

      await updateMealPlan(updatedPlan);
    },
    [updateMealPlan]
  );

  const removeMealFromSlot = useCallback(
    async (
      day: DayOfWeek,
      slot: MealSlot
    ): Promise<void> => {
      const currentPlan = mealPlanRef.current;

      if (currentPlan[day][slot] === null) {
        return;
      }

      const updatedPlan: WeeklyMealPlan = {
        ...currentPlan,

        [day]: {
          ...currentPlan[day],
          [slot]: null,
        },
      };

      await updateMealPlan(updatedPlan);
    },
    [updateMealPlan]
  );

  const clearMealPlan = useCallback(
    async (): Promise<void> => {
      try {
        setError(null);

        await clearStoredMealPlan();

        const emptyPlan = createEmptyMealPlan();

        mealPlanRef.current = emptyPlan;
        setMealPlan(emptyPlan);
      } catch (caughtError) {
        console.error(
          "Failed to clear meal plan:",
          caughtError
        );

        setError(
          "Unable to clear the weekly meal plan."
        );
      }
    },
    []
  );

  return {
    mealPlan,
    isLoading,
    error,
    getMealForSlot,
    isSlotOccupied,
    setMealForSlot,
    removeMealFromSlot,
    clearMealPlan,
  };
}