import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import { useNavigation } from
  "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { DayMealCard } from
  "../components/DayMealCard";

import { useMealPlan } from
  "../context/MealPlanContext";

import {
  DAYS_OF_WEEK,
  MEAL_SLOTS,
} from "../models/MealPlan";

import type {
  DayOfWeek,
  MealSlot,
} from "../models/MealPlan";

import type {
  RootStackParamList,
} from "../navigation/navigationTypes";

import {
  colors,
  fontSize,
  spacing,
} from "../theme/theme";

type WeeklyPlanNavigation =
  NativeStackNavigationProp<RootStackParamList>;

function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function formatSlot(slot: MealSlot): string {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function WeeklyPlanScreen() {
  const navigation =
    useNavigation<WeeklyPlanNavigation>();

  const {
    mealPlan,
    isLoading,
    error,
    removeMealFromSlot,
    clearMealPlan,
  } = useMealPlan();

  const hasPlannedMeals = DAYS_OF_WEEK.some(
    (day) =>
      MEAL_SLOTS.some(
        (slot) => mealPlan[day][slot] !== null
      )
  );

  function handleMealPress(mealId: string) {
    navigation.navigate("MealDetails", {
      mealId,
    });
  }

  function handleRemoveMeal(
    day: DayOfWeek,
    slot: MealSlot
  ) {
    const meal = mealPlan[day][slot];

    if (!meal) {
      return;
    }

    Alert.alert(
      "Remove meal?",
      `Remove ${meal.strMeal} from ${formatDay(day)} ${formatSlot(slot)}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void removeMealFromSlot(day, slot);
          },
        },
      ]
    );
  }

  function handleClearPlan() {
    if (!hasPlannedMeals) {
      return;
    }

    Alert.alert(
      "Clear weekly plan?",
      "This will remove every planned meal.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            void clearMealPlan();
          },
        },
      ]
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          color={colors.primary}
          size="large"
        />

        <Text style={styles.loadingText}>
          Loading weekly plan...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Your Week
          </Text>

          <Text style={styles.subtitle}>
            Plan breakfast, lunch, and dinner.
          </Text>
        </View>

        {hasPlannedMeals && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.pressed,
            ]}
            onPress={handleClearPlan}
            accessibilityRole="button"
            accessibilityLabel="Clear weekly meal plan"
          >
            <Ionicons
              name="trash-outline"
              color={colors.error}
              size={18}
            />

            <Text style={styles.clearButtonText}>
              Clear
            </Text>
          </Pressable>
        )}
      </View>

      {!hasPlannedMeals && !error && (
        <View style={styles.emptyBanner}>
          <Ionicons
            name="calendar-outline"
            color={colors.primary}
            size={24}
          />

          <Text style={styles.emptyBannerText}>
            Your week is empty. Add meals from a
            recipe’s details page.
          </Text>
        </View>
      )}

      <FlatList
        data={DAYS_OF_WEEK}
        keyExtractor={(day) => day}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: day }) => (
          <DayMealCard
            day={day}
            dailyPlan={mealPlan[day]}
            onMealPress={handleMealPress}
            onRemove={handleRemoveMeal}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },

  centered: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  error: {
    color: colors.error,
    marginTop: spacing.md,
    textAlign: "center",
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.md,
    paddingTop: spacing.lg,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
  },

  clearButton: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },

  clearButtonText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },

  pressed: {
    opacity: 0.6,
  },

  emptyBanner: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: spacing.sm,
    padding: spacing.md,
  },

  emptyBannerText: {
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
    marginLeft: spacing.md,
  },

  list: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
});