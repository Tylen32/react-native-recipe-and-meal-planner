import type {
  DayOfWeek,
} from "../models/MealPlan";

export function getDayOfWeek(
  date: Date = new Date()
): DayOfWeek {
  switch (date.getDay()) {
    case 0:
      return "sunday";

    case 1:
      return "monday";

    case 2:
      return "tuesday";

    case 3:
      return "wednesday";

    case 4:
      return "thursday";

    case 5:
      return "friday";

    case 6:
      return "saturday";

    default:
      throw new Error("Invalid day of week.");
  }
}

export function formatDayOfWeek(
  day: DayOfWeek
): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}