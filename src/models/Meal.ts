export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type Meal = {
idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string;
  strYoutube: string | null;
  strSource: string | null;
};

export type MealSearchResponse = {
  meals: Meal[] | null;
};

export type MealFilterResponse = {
  meals: MealSummary[] | null;
};