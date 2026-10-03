import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from
  "@expo/vector-icons/Ionicons";

import { useMealPlan } from
  "../context/MealPlanContext";

import {
  MEAL_SLOTS,
} from "../models/MealPlan";

import type {
  MealSlot,
} from "../models/MealPlan";

import {
  colors,
  fontSize,
  radius,
  shadows,
  spacing,
} from "../theme/theme";

import {
  formatDayOfWeek,
  getDayOfWeek,
} from "../utils/date";

import { AppButton } from "./AppButton";

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

        <Pressable
          style={({ pressed }) => [
            styles.findMealsLink,
            pressed && styles.pressed,
          ]}
          onPress={onFindMeals}
          accessibilityRole="button"
          accessibilityLabel="Find meals"
        >
          <Text style={styles.findMealsText}>
            Find meals
          </Text>

          <Ionicons
            name="arrow-forward"
            color={colors.primary}
            size={17}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator
          color={colors.primary}
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
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="calendar-outline"
                  color={colors.primary}
                  size={30}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Nothing planned for today
              </Text>

              <Text style={styles.emptyMessage}>
                Find a meal and add it to breakfast,
                lunch, or dinner.
              </Text>

              <AppButton
                title="Find a Meal"
                onPress={onFindMeals}
                style={styles.findButton}
              />
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
                      style={({ pressed }) => [
                        styles.mealRow,
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
                        size={20}
                      />
                    </Pressable>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.emptySlot,
                        pressed && styles.pressed,
                      ]}
                      onPress={onFindMeals}
                      accessibilityRole="button"
                      accessibilityLabel={
                        `Find a meal for ${formatSlot(slot)}`
                      }
                    >
                      <Text
                        style={styles.emptySlotText}
                      >
                        No meal planned
                      </Text>

                      <Text style={styles.addMealText}>
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,

    ...shadows.card,
  },

  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  title: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
  },

  day: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },

  findMealsLink: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
    paddingLeft: spacing.sm,
  },

  findMealsText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
    marginRight: spacing.xs,
  },

  pressed: {
    opacity: 0.7,
  },

  loading: {
    marginVertical: spacing.xl,
  },

  error: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 58,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 58,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: fontSize.subtitle,
    fontWeight: "600",
  },

  emptyMessage: {
    color: colors.textSecondary,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  findButton: {
    marginTop: spacing.lg,
    minWidth: 150,
  },

  slotContainer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: spacing.md,
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
    minHeight: 60,
  },

  image: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    height: 56,
    width: 56,
  },

  mealName: {
    color: colors.text,
    flex: 1,
    fontSize: fontSize.body,
    fontWeight: "500",
    marginHorizontal: spacing.md,
  },

  emptySlot: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },

  emptySlotText: {
    color: colors.textSecondary,
    fontStyle: "italic",
  },

  addMealText: {
    color: colors.primary,
    fontWeight: "600",
  },
});