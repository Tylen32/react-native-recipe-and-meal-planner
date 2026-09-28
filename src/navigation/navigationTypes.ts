export type RootStackParamList = {
  MainTabs: undefined;

  MealDetails: {
    mealId: string;
  };

  CategoryMeals: {
    category: string;
  };
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  WeeklyPlan: undefined;
};