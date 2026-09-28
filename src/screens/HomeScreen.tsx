import {
  ActivityIndicator,
  FlatList,
  Pressable,
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

      <TodaysMealPlan
        onMealPress={handleMealPress}
        onFindMeals={handleFindMeals}
      />

      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>
          Browse Categories
        </Text>

        {categoriesAreLoading && (
          <View style={styles.categoryLoading}>
            <ActivityIndicator size="small" />

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

              <Pressable
                style={styles.retryButton}
                onPress={() =>
                  void reloadCategories()
                }
              >
                <Text
                  style={styles.retryButtonText}
                >
                  Try Again
                </Text>
              </Pressable>
            </View>
          )}

        {!categoriesAreLoading &&
          !categoriesError &&
          categories.length === 0 && (
            <Text style={styles.emptyText}>
              No categories are available.
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
    backgroundColor: "#f4f4f4",
  },
  content: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  introduction: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666666",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 6,
  },
  categorySection: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryLoading: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingText: {
    color: "#666666",
    marginLeft: 10,
  },
  categoryError: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  errorText: {
    color: "#b00020",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#d35400",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyText: {
    color: "#777777",
    paddingHorizontal: 16,
  },
});