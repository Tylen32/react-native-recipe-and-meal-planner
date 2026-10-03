import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useNavigation } from
  "@react-navigation/native";

import type {
  CompositeNavigationProp,
} from "@react-navigation/native";

import type {
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { AppButton } from
  "../components/AppButton";

import { CategoryCard } from
  "../components/CategoryCard";

import { TodaysMealPlan } from
  "../components/TodaysMealPlan";

import { useCategories } from
  "../hooks/useCategories";

import type {
  BottomTabParamList,
  RootStackParamList,
} from "../navigation/navigationTypes";

import {
  colors,
  fontSize,
  spacing,
} from "../theme/theme";

type HomeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<
    BottomTabParamList,
    "Home"
  >,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const navigation =
    useNavigation<HomeNavigation>();

  const {
    categories,
    isLoading: categoriesAreLoading,
    error: categoriesError,
    reloadCategories,
  } = useCategories();

  function handleMealPress(mealId: string) {
    navigation.navigate("MealDetails", {
      mealId,
    });
  }

  function handleFindMeals() {
    navigation.navigate("Search");
  }

  function handleCategoryPress(category: string) {
    navigation.navigate("CategoryMeals", {
      category,
    });
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.introduction}>
        <Text style={styles.title}>
          Meal Planner
        </Text>

        <Text style={styles.subtitle}>
          Discover recipes and organize your meals
          for the week.
        </Text>
      </View>

      <View style={styles.todaySection}>
        <TodaysMealPlan
          onMealPress={handleMealPress}
          onFindMeals={handleFindMeals}
        />
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>
          Browse Categories
        </Text>

        <Text style={styles.sectionSubtitle}>
          Find your next meal by category.
        </Text>

        {categoriesAreLoading && (
          <View style={styles.categoryLoading}>
            <ActivityIndicator
              color={colors.primary}
              size="small"
            />

            <Text style={styles.loadingText}>
              Loading categories...
            </Text>
          </View>
        )}

        {!categoriesAreLoading &&
          categoriesError && (
            <View style={styles.categoryError}>
              <Text style={styles.errorText}>
                {categoriesError}
              </Text>

              <AppButton
                title="Try Again"
                variant="outline"
                onPress={reloadCategories}
                style={styles.retryButton}
              />
            </View>
          )}

        {!categoriesAreLoading &&
          !categoriesError &&
          categories.length === 0 && (
            <Text style={styles.emptyText}>
              No categories are currently available.
            </Text>
          )}

        {!categoriesAreLoading &&
          !categoriesError &&
          categories.length > 0 && (
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(category) =>
                category.idCategory
              }
              contentContainerStyle={
                styles.categoryList
              }
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  onPress={() =>
                    handleCategoryPress(
                      item.strCategory
                    )
                  }
                />
              )}
            />
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.lg,
  },

  introduction: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "700",
    lineHeight: 36,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 23,
    marginTop: spacing.sm,
  },

  todaySection: {
    paddingHorizontal: spacing.lg,
  },

  categorySection: {
    marginTop: spacing.xxl,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
    paddingHorizontal: spacing.lg,
  },

  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },

  categoryList: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  categoryLoading: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  loadingText: {
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },

  categoryError: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  errorText: {
    color: colors.error,
    textAlign: "center",
  },

  retryButton: {
    marginTop: spacing.lg,
    minWidth: 140,
  },

  emptyText: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
  },
});