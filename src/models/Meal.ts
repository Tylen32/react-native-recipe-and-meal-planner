export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type Ingredient = {
  name: string;
  measure: string;
};

export type Meal = MealSummary & {
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string;
  strYoutube: string | null;
  strSource: string | null;
  ingredients: Ingredient[];
};

type IngredientNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

type IngredientFields = Partial<
  Record<
    `strIngredient${IngredientNumber}`,
    string | null
  >
>;

type MeasureFields = Partial<
  Record<
    `strMeasure${IngredientNumber}`,
    string | null
  >
>;

export type MealDbMeal = MealSummary & {
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strYoutube: string | null;
  strSource: string | null;
} & IngredientFields &
  MeasureFields;

export type MealSearchResponse = {
  meals: MealDbMeal[] | null;
};

export type MealDetailsResponse = {
  meals: MealDbMeal[] | null;
};

export type MealFilterResponse = {
  meals: MealSummary[] | null;
};