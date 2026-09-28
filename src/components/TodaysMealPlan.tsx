import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMealPlan } from
  "../context/MealPlanContext";

import {
  MEAL_SLOTS,
} from "../models/MealPlan";

import type {
  MealSlot,
} from "../models/MealPlan";

import {
  formatDayOfWeek,
  getDayOfWeek,
} from "../utils/date";

type TodaysMealPlanProps = {
  onMealPress: (mealId: string) => void;
  onFindMeals: () => void;
};

function formatSlot(slot: MealSlot): string {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function TodaysMealPlan({
  onMealPress,
  onFindMeals,
}: TodaysMealPlanProps) {
  const {
    mealPlan,
    isLoading,
    error,
  } = useMealPlan();

  const today = getDayOfWeek();
  const todaysPlan = mealPlan[today];

  const hasPlannedMeals = MEAL_SLOTS.some(
    (slot) => todaysPlan[slot] !== null
  );

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <View>
          <Text style={styles.title}>
            Today’s Meals
          </Text>

          <Text style={styles.day}>
            {formatDayOfWeek(today)}
          </Text>
        </View>

        <Pressable onPress={onFindMeals}>
          <Text style={styles.findMealsText}>
            Find meals
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="small"
          style={styles.loading}
        />
      ) : (
        <>
          {error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}

          {!hasPlannedMeals && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                Nothing planned for today
              </Text>

              <Text style={styles.emptyMessage}>
                Find a meal and add it to your
                breakfast, lunch, or dinner.
              </Text>

              <Pressable
                style={styles.findButton}
                onPress={onFindMeals}
              >
                <Text style={styles.findButtonText}>
                  Find a Meal
                </Text>
              </Pressable>
            </View>
          )}

          {hasPlannedMeals &&
            MEAL_SLOTS.map((slot) => {
              const meal = todaysPlan[slot];

              return (
                <View
                  key={slot}
                  style={styles.slotContainer}
                >
                  <Text style={styles.slotTitle}>
                    {formatSlot(slot)}
                  </Text>

                  {meal ? (
                    <Pressable
                      style={styles.mealRow}
                      onPress={() =>
                        onMealPress(meal.idMeal)
                      }
                    >
                      <Image
                        source={{
                          uri: meal.strMealThumb,
                        }}
                        style={styles.image}
                      />

                      <Text
                        style={styles.mealName}
                        numberOfLines={2}
                      >
                        {meal.strMeal}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.emptySlot}
                      onPress={onFindMeals}
                    >
                      <Text
                        style={styles.emptySlotText}
                      >
                        No meal planned
                      </Text>

                      <Text
                        style={styles.addMealText}
                      >
                        Find meal
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
  },
  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
  },
  day: {
    color: "#666666",
    fontSize: 14,
    marginTop: 2,
  },
  findMealsText: {
    color: "#d35400",
    fontSize: 15,
    fontWeight: "600",
  },
  loading: {
    marginVertical: 24,
  },
  error: {
    color: "#b00020",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptyMessage: {
    color: "#666666",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "center",
  },
  findButton: {
    backgroundColor: "#d35400",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  findButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  slotContainer: {
    borderTopColor: "#eeeeee",
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  slotTitle: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  mealRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  image: {
    borderRadius: 8,
    height: 55,
    width: 55,
  },
  mealName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  emptySlot: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  emptySlotText: {
    color: "#888888",
    fontStyle: "italic",
  },
  addMealText: {
    color: "#d35400",
    fontWeight: "600",
  },
});