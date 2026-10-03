import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
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

import { useFavorites } from
  "../context/FavoritesContext";

import { useMealPlan } from
  "../context/MealPlanContext";

import { useMealDetails } from
  "../hooks/useMealDetails";

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
  radius,
  shadows,
  spacing,
} from "../theme/theme";

type MealDetailsScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    "MealDetails"
  >;

function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function formatSlot(slot: MealSlot): string {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function MealDetailsScreen({
  route,
}: MealDetailsScreenProps) {
  const { mealId } = route.params;

  const [isPlannerVisible, setIsPlannerVisible] =
    useState(false);

  const [selectedDay, setSelectedDay] =
    useState<DayOfWeek | null>(null);

  const {
    meal,
    isLoading,
    error: mealError,
  } = useMealDetails(mealId);

  const {
    isFavorite,
    toggleFavorite,
    error: favoriteError,
  } = useFavorites();

  const {
    getMealForSlot,
    setMealForSlot,
    error: mealPlanError,
  } = useMealPlan();

  const mealIsFavorite = meal
    ? isFavorite(meal.idMeal)
    : false;

  function openPlanner() {
    setSelectedDay(null);
    setIsPlannerVisible(true);
  }

  function closePlanner() {
    setSelectedDay(null);
    setIsPlannerVisible(false);
  }

  function handleModalBack() {
    if (selectedDay) {
      setSelectedDay(null);
    } else {
      closePlanner();
    }
  }

  function handleFavoritePress() {
    if (!meal) {
      return;
    }

    void toggleFavorite(meal);
  }

  async function saveMealToSlot(
    day: DayOfWeek,
    slot: MealSlot
  ) {
    if (!meal) {
      return;
    }

    await setMealForSlot(day, slot, meal);
    closePlanner();
  }

  function handleSlotSelection(slot: MealSlot) {
    if (!meal || !selectedDay) {
      return;
    }

    const day = selectedDay;
    const existingMeal =
      getMealForSlot(day, slot);

    if (existingMeal?.idMeal === meal.idMeal) {
      Alert.alert(
        "Already planned",
        `${meal.strMeal} is already planned for ${formatDay(day)} ${formatSlot(slot)}.`
      );

      closePlanner();
      return;
    }

    if (existingMeal) {
      Alert.alert(
        "Replace planned meal?",
        `${formatDay(day)} ${formatSlot(slot)} already has ${existingMeal.strMeal}.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Replace",
            style: "destructive",
            onPress: () => {
              void saveMealToSlot(day, slot);
            },
          },
        ]
      );

      return;
    }

    void saveMealToSlot(day, slot);
  }

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator
          color={colors.primary}
          size="large"
        />

        <Text style={styles.stateMessage}>
          Loading meal...
        </Text>
      </View>
    );
  }

  if (mealError) {
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
          {mealError}
        </Text>
      </View>
    );
  }

  if (!meal) {
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
          Meal not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.summary}>
          <Text style={styles.title}>
            {meal.strMeal}
          </Text>

          <View style={styles.metadataRow}>
            <View style={styles.metadataChip}>
              <Ionicons
                name="restaurant-outline"
                color={colors.primary}
                size={16}
              />

              <Text style={styles.metadataText}>
                {meal.strCategory ?? "No category"}
              </Text>
            </View>

            <View style={styles.metadataChip}>
              <Ionicons
                name="earth-outline"
                color={colors.secondary}
                size={16}
              />

              <Text style={styles.metadataText}>
                {meal.strArea ?? "Unknown cuisine"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            title={
              mealIsFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"
            }
            variant={
              mealIsFavorite ? "danger" : "primary"
            }
            onPress={handleFavoritePress}
          />

          <AppButton
            title="Add to Weekly Plan"
            variant="secondary"
            onPress={openPlanner}
            style={styles.secondaryAction}
          />
        </View>

        {favoriteError && (
          <Text style={styles.inlineError}>
            {favoriteError}
          </Text>
        )}

        {mealPlanError && (
          <Text style={styles.inlineError}>
            {mealPlanError}
          </Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ingredients
          </Text>

          {meal.ingredients.length > 0 ? (
            <View style={styles.ingredientList}>
              {meal.ingredients.map(
                (ingredient, index) => (
                  <View
                    key={
                      `${ingredient.name}-${index}`
                    }
                    style={[
                      styles.ingredientRow,

                      index <
                        meal.ingredients.length - 1 &&
                        styles.ingredientBorder,
                    ]}
                  >
                    <Text
                      style={styles.ingredientName}
                    >
                      {ingredient.name}
                    </Text>

                    <Text
                      style={
                        styles.ingredientMeasure
                      }
                    >
                      {ingredient.measure ||
                        "Amount not specified"}
                    </Text>
                  </View>
                )
              )}
            </View>
          ) : (
            <Text style={styles.unavailableText}>
              Ingredient information is unavailable.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Instructions
          </Text>

          <View style={styles.instructionsCard}>
            <Text style={styles.instructions}>
              {meal.strInstructions ||
                "Instructions are unavailable."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isPlannerVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalBack}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            {selectedDay === null ? (
              <>
                <Text style={styles.modalTitle}>
                  Select a day
                </Text>

                <Text style={styles.modalSubtitle}>
                  When would you like to plan this
                  meal?
                </Text>

                {DAYS_OF_WEEK.map((day) => {
                  const occupiedSlots =
                    MEAL_SLOTS.filter(
                      (slot) =>
                        getMealForSlot(day, slot) !==
                        null
                    ).length;

                  return (
                    <Pressable
                      key={day}
                      style={({ pressed }) => [
                        styles.modalOption,
                        pressed &&
                          styles.optionPressed,
                      ]}
                      onPress={() =>
                        setSelectedDay(day)
                      }
                    >
                      <View style={styles.optionText}>
                        <Text
                          style={
                            styles.optionTitle
                          }
                        >
                          {formatDay(day)}
                        </Text>

                        <Text
                          style={
                            styles.optionSubtitle
                          }
                        >
                          {occupiedSlots === 0
                            ? "No meals planned"
                            : `${occupiedSlots} of 3 meals planned`}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        color={colors.textSecondary}
                        size={20}
                      />
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  {formatDay(selectedDay)}
                </Text>

                <Text style={styles.modalSubtitle}>
                  Select a meal slot.
                </Text>

                {MEAL_SLOTS.map((slot) => {
                  const existingMeal =
                    getMealForSlot(
                      selectedDay,
                      slot
                    );

                  return (
                    <Pressable
                      key={slot}
                      style={({ pressed }) => [
                        styles.modalOption,
                        pressed &&
                          styles.optionPressed,
                      ]}
                      onPress={() =>
                        handleSlotSelection(slot)
                      }
                    >
                      <View style={styles.optionText}>
                        <Text
                          style={
                            styles.optionTitle
                          }
                        >
                          {formatSlot(slot)}
                        </Text>

                        <Text
                          style={
                            styles.optionSubtitle
                          }
                          numberOfLines={1}
                        >
                          {existingMeal
                            ? existingMeal.strMeal
                            : "No meal planned"}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        color={colors.textSecondary}
                        size={20}
                      />
                    </Pressable>
                  );
                })}
              </>
            )}

            <AppButton
              title={selectedDay ? "Back" : "Cancel"}
              variant="outline"
              onPress={handleModalBack}
              style={styles.modalAction}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },

  content: {
    paddingBottom: spacing.xxl,
  },

  heroImage: {
    backgroundColor: colors.surfaceMuted,
    height: 310,
    width: "100%",
  },

  summary: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  title: {
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "700",
    lineHeight: 37,
  },

  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
  },

  metadataChip: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: "row",
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  metadataText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },

  actions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  secondaryAction: {
    marginTop: spacing.md,
  },

  inlineError: {
    color: colors.error,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    textAlign: "center",
  },

  section: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  ingredientList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,

    ...shadows.card,
  },

  ingredientRow: {
    paddingVertical: spacing.md,
  },

  ingredientBorder: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },

  ingredientName: {
    color: colors.text,
    fontSize: fontSize.body,
    fontWeight: "600",
  },

  ingredientMeasure: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
  },

  unavailableText: {
    color: colors.textSecondary,
    fontStyle: "italic",
  },

  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,

    ...shadows.card,
  },

  instructions: {
    color: colors.text,
    fontSize: fontSize.body,
    lineHeight: 25,
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
    height: 64,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 64,
  },

  stateTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
  },

  stateMessage: {
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  errorText: {
    color: colors.error,
    fontSize: fontSize.body,
    textAlign: "center",
  },

  modalBackdrop: {
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  modalHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    height: 5,
    marginBottom: spacing.lg,
    width: 44,
  },

  modalTitle: {
    color: colors.text,
    fontSize: fontSize.sectionTitle,
    fontWeight: "700",
    textAlign: "center",
  },

  modalSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    textAlign: "center",
  },

  modalOption: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 62,
    paddingVertical: spacing.sm,
  },

  optionPressed: {
    opacity: 0.6,
  },

  optionText: {
    flex: 1,
    marginRight: spacing.md,
  },

  optionTitle: {
    color: colors.text,
    fontSize: fontSize.body,
    fontWeight: "600",
  },

  optionSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
  },

  modalAction: {
    marginTop: spacing.lg,
  },
});