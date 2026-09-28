import {
  createContext,
  useContext,
} from "react";

import type { PropsWithChildren } from "react";

import {
  useMealPlanManager,
} from "../hooks/useMealPlanManager";

type MealPlanContextValue =
  ReturnType<typeof useMealPlanManager>;

const MealPlanContext =
  createContext<MealPlanContextValue | undefined>(
    undefined
  );

export function MealPlanProvider({
  children,
}: PropsWithChildren) {
  const mealPlanManager =
    useMealPlanManager();

  return (
    <MealPlanContext.Provider
      value={mealPlanManager}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);

  if (!context) {
    throw new Error(
      "useMealPlan must be used inside MealPlanProvider"
    );
  }

  return context;
}