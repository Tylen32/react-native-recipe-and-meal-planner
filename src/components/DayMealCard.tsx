import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MEAL_SLOTS,
} from "../models/MealPlan";

import type {
  DailyMealPlan,
  DayOfWeek,
  MealSlot,
} from "../models/MealPlan";

type DayMealCardProps = {
  day: DayOfWeek;
  dailyPlan: DailyMealPlan;
  onMealPress: (mealId: string) => void;
  onRemove: (
    day: DayOfWeek,
    slot: MealSlot
  ) => void;
};

function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function formatSlot(slot: MealSlot): string {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function DayMealCard({
  day,
  dailyPlan,
  onMealPress,
  onRemove,
}: DayMealCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.dayTitle}>
        {formatDay(day)}
      </Text>

      {MEAL_SLOTS.map((slot, index) => {
        const meal = dailyPlan[slot];

        return (
          <View
            key={slot}
            style={[
              styles.slotContainer,
              index < MEAL_SLOTS.length - 1 &&
                styles.slotBorder,
            ]}
          >
            <Text style={styles.slotTitle}>
              {formatSlot(slot)}
            </Text>

            {meal ? (
              <View style={styles.mealRow}>
                <Pressable
                  style={styles.mealButton}
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

                <Pressable
                  style={styles.removeButton}
                  onPress={() =>
                    onRemove(day, slot)
                  }
                >
                  <Text style={styles.removeText}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.emptyText}>
                No meal planned
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 14,
  },
  dayTitle: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 4,
  },
  slotContainer: {
    paddingVertical: 12,
  },
  slotBorder: {
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
  },
  slotTitle: {
    color: "#555555",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  mealRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  mealButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  image: {
    borderRadius: 8,
    height: 60,
    width: 60,
  },
  mealName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  removeButton: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  removeText: {
    color: "#b00020",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    color: "#888888",
    fontSize: 15,
    fontStyle: "italic",
    paddingVertical: 6,
  },
});