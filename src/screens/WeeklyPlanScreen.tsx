import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
        <ActivityIndicator size="large" />

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
            style={styles.clearButton}
            onPress={handleClearPlan}
          >
            <Text style={styles.clearButtonText}>
              Clear
            </Text>
          </Pressable>
        )}
      </View>

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
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: "#666666",
    marginTop: 12,
  },
  error: {
    color: "#b00020",
    marginTop: 12,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingTop: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666666",
    fontSize: 15,
    marginTop: 3,
  },
  clearButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: "#b00020",
    fontSize: 15,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 30,
    paddingTop: 8,
  },
});