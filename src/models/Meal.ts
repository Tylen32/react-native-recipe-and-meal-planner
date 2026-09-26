// Models for the API Responsew
export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type Ingredient = {
  name: string;
  measure: string;
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
  ingredients: Ingredient[];
};

export type MealSearchResponse = {
  meals: Meal[] | null;
};

export type MealFilterResponse = {
  meals: MealSummary[] | null;
};

export type MealDetailsResponse = {
  meals: Meal[] | null;
};