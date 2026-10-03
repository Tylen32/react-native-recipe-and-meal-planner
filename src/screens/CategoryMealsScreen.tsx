import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { AppButton } from
  "../components/AppButton";

import { MealCard } from
  "../components/MealCard";

import { useCategoryMeals } from
  "../hooks/useCategoryMeals";

import type {
  RootStackParamList,
} from "../navigation/navigationTypes";

import {
  colors,
  fontSize,
  radius,
  spacing,
} from "../theme/theme";

type CategoryMealsScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "CategoryMeals"
  >;

export function CategoryMealsScreen({
  route,
  navigation,
}: CategoryMealsScreenProps) {
  const { category } = route.params;

  const {
    meals,
    isLoading,
    error,
    reloadCategoryMeals,
  } = useCategoryMeals(category);

  function handleMealPress(mealId: string) {
    navigation.navigate("MealDetails", {
      mealId,
    });
  }

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator
          color={colors.primary}
          size="large"
        />

        <Text style={styles.stateMessage}>
          Loading {category} meals...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="alert-circle-outline"
            color={colors.error}
            size={32}
          />
        </View>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <AppButton
          title="Try Again"
          variant="outline"
          onPress={reloadCategoryMeals}
          style={styles.stateButton}
        />
      </View>
    );
  }

  if (meals.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="restaurant-outline"
            color={colors.primary}
            size={32}
          />
        </View>

        <Text style={styles.stateTitle}>
          No meals found
        </Text>

        <Text style={styles.stateMessage}>
          There are currently no meals in the{" "}
          {category} category.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          {category}
        </Text>

        <Text style={styles.resultsText}>
          {meals.length}{" "}
          {meals.length === 1 ? "meal" : "meals"}
        </Text>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(meal) => meal.idMeal}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            onPress={() =>
              handleMealPress(item.idMeal)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  summary: {
    paddingBottom: spacing.md,
    paddingTop: spacing.lg,
  },

  summaryTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
  },

  resultsText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
  },

  list: {
    paddingBottom: spacing.xxl,
  },

  stateContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },

  stateIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 62,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 62,
  },

  stateTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
    textAlign: "center",
  },

  stateMessage: {
    color: colors.textSecondary,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  errorText: {
    color: colors.error,
    fontSize: fontSize.body,
    textAlign: "center",
  },

  stateButton: {
    marginTop: spacing.lg,
    minWidth: 140,
  },
});