import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import {
  MEAL_SLOTS,
} from "../models/MealPlan";

import type {
  DailyMealPlan,
  DayOfWeek,
  MealSlot,
} from "../models/MealPlan";

import {
  colors,
  fontSize,
  radius,
  shadows,
  spacing,
} from "../theme/theme";

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
                  style={({ pressed }) => [
                    styles.mealButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    onMealPress(meal.idMeal)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    `Open ${meal.strMeal}`
                  }
                >
                  <Image
                    source={{
                      uri: meal.strMealThumb,
                    }}
                    style={styles.image}
                    accessible={false}
                  />

                  <Text
                    style={styles.mealName}
                    numberOfLines={2}
                  >
                    {meal.strMeal}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    color={colors.textSecondary}
                    size={19}
                  />
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    onRemove(day, slot)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    `Remove ${meal.strMeal} from ${formatDay(day)} ${formatSlot(slot)}`
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    color={colors.error}
                    size={20}
                  />
                </Pressable>
              </View>
            ) : (
              <View style={styles.emptySlot}>
                <Ionicons
                  name="restaurant-outline"
                  color={colors.textSecondary}
                  size={18}
                />

                <Text style={styles.emptyText}>
                  No meal planned
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,

    ...shadows.card,
  },

  dayTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },

  slotContainer: {
    paddingVertical: spacing.md,
  },

  slotBorder: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },

  slotTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: "700",
    marginBottom: spacing.sm,
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
    minHeight: 60,
  },

  image: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    height: 58,
    width: 58,
  },

  mealName: {
    color: colors.text,
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: "500",
    marginHorizontal: spacing.md,
  },

  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
    minHeight: 44,
    minWidth: 44,
  },

  emptySlot: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },

  emptyText: {
    color: colors.textSecondary,
    fontStyle: "italic",
    marginLeft: spacing.sm,
  },

  pressed: {
    opacity: 0.65,
  },
});