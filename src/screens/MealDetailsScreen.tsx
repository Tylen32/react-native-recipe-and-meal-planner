import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useFavorites } from "../context/FavoritesContext";

import { useMealPlan } from "../context/MealPlanContext";

import { useMealDetails } from "../hooks/useMealDetails";

import { DAYS_OF_WEEK, MEAL_SLOTS } from "../models/MealPlan";

import type { DayOfWeek, MealSlot } from "../models/MealPlan";

import type { RootStackParamList } from "../navigation/navigationTypes";

type MealDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MealDetails"
>;

function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function formatSlot(slot: MealSlot): string {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function MealDetailsScreen({ route }: MealDetailsScreenProps) {
  const { mealId } = route.params;

  const [isPlannerVisible, setIsPlannerVisible] = useState(false);

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);

  const { meal, isLoading, error: mealError } = useMealDetails(mealId);

  const { isFavorite, toggleFavorite, error: favoriteError } = useFavorites();

  const {
    getMealForSlot,
    setMealForSlot,
    error: mealPlanError,
  } = useMealPlan();

  const mealIsFavorite = meal ? isFavorite(meal.idMeal) : false;

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

  async function saveMealToSlot(day: DayOfWeek, slot: MealSlot) {
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
    const existingMeal = getMealForSlot(day, slot);

    if (existingMeal?.idMeal === meal.idMeal) {
      Alert.alert(
        "Already planned",
        `${meal.strMeal} is already planned for ${formatDay(day)} ${formatSlot(slot)}.`,
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
        ],
      );

      return;
    }

    void saveMealToSlot(day, slot);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading meal...</Text>
      </View>
    );
  }

  if (mealError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{mealError}</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centered}>
        <Text>Meal not found.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

        <Text style={styles.title}>{meal.strMeal}</Text>

        <Text style={styles.metadata}>
          {meal.strCategory ?? "No category"}
          {" • "}
          {meal.strArea ?? "Unknown cuisine"}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title={
              mealIsFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
            onPress={handleFavoritePress}
            color={mealIsFavorite ? "#b00020" : "#d35400"}
          />

          <View style={styles.buttonSpacing} />

          <Button
            title="Add to Weekly Plan"
            onPress={openPlanner}
            color="#2e7d32"
          />
        </View>

        {favoriteError && <Text style={styles.error}>{favoriteError}</Text>}

        {mealPlanError && <Text style={styles.error}>{mealPlanError}</Text>}

        <Text style={styles.heading}>Ingredients</Text>

        {meal.ingredients.length > 0 ? (
          <View style={styles.ingredientList}>
            {meal.ingredients.map((ingredient, index) => (
              <View
                key={`${ingredient.name}-${index}`}
                style={[
                  styles.ingredientRow,
                  index < meal.ingredients.length - 1 &&
                    styles.ingredientBorder,
                ]}
              >
                <Text style={styles.ingredientName}>{ingredient.name}</Text>

                <Text style={styles.ingredientMeasure}>
                  {ingredient.measure || "Amount not specified"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noIngredients}>
            Ingredient information is unavailable.
          </Text>
        )}

        <Text style={styles.heading}>Instructions</Text>

        <Text style={styles.instructions}>{meal.strInstructions}</Text>
      </ScrollView>

      <Modal
        visible={isPlannerVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalBack}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedDay === null ? (
              <>
                <Text style={styles.modalTitle}>Select a day</Text>

                {DAYS_OF_WEEK.map((day) => {
                  const occupiedSlots = MEAL_SLOTS.filter(
                    (slot) => getMealForSlot(day, slot) !== null,
                  ).length;

                  return (
                    <Pressable
                      key={day}
                      style={styles.option}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={styles.optionTitle}>{formatDay(day)}</Text>

                      <Text style={styles.optionSubtitle}>
                        {occupiedSlots === 0
                          ? "No meals planned"
                          : `${occupiedSlots} of 3 meals planned`}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>{formatDay(selectedDay)}</Text>

                <Text style={styles.modalSubtitle}>Select a meal slot</Text>

                {MEAL_SLOTS.map((slot) => {
                  const existingMeal = getMealForSlot(selectedDay, slot);

                  return (
                    <Pressable
                      key={slot}
                      style={styles.option}
                      onPress={() => handleSlotSelection(slot)}
                    >
                      <Text style={styles.optionTitle}>{formatSlot(slot)}</Text>

                      <Text style={styles.optionSubtitle} numberOfLines={1}>
                        {existingMeal
                          ? existingMeal.strMeal
                          : "No meal planned"}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            )}

            <Pressable style={styles.modalAction} onPress={handleModalBack}>
              <Text style={styles.modalActionText}>
                {selectedDay ? "Back" : "Cancel"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
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
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
  },
  metadata: {
    color: "#666666",
    fontSize: 16,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonSpacing: {
    height: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 24,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    color: "#b00020",
    marginTop: 12,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 35,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSubtitle: {
    color: "#666666",
    fontSize: 15,
    marginBottom: 12,
    marginTop: 4,
    textAlign: "center",
  },
  option: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    paddingVertical: 13,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  optionSubtitle: {
    color: "#666666",
    fontSize: 14,
    marginTop: 3,
  },
  modalAction: {
    alignItems: "center",
    marginTop: 16,
    padding: 12,
  },
  modalActionText: {
    color: "#b00020",
    fontSize: 17,
    fontWeight: "600",
  },
  ingredientList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  ingredientRow: {
    paddingVertical: 12,
  },

  ingredientBorder: {
    borderBottomColor: "#e5e5e5",
    borderBottomWidth: 1,
  },

  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
  },

  ingredientMeasure: {
    color: "#666666",
    fontSize: 15,
    marginTop: 3,
  },

  noIngredients: {
    color: "#777777",
    fontSize: 15,
    fontStyle: "italic",
  },
});
