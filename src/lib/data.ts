// Room series for each resort
export const ROOM_SERIES = {
  1: [
    { name: "600-693", start: 600, end: 693 },
    { name: "800-820", start: 800, end: 820 },
    { name: "840-897", start: 840, end: 897 },
  ],
  2: [
    { name: "100-130", start: 100, end: 130 },
    { name: "200-218", start: 200, end: 218 },
    { name: "300-343", start: 300, end: 343 },
  ],
};

// Meal times Constants
export const MEAL_TIMES = {
  breakfast: { start: "06:00:00", end: "11:00:00" },
  lunch: { start: "12:00:00", end: "16:00:00" },
  dinner: { start: "18:00:00", end: "23:00:00" },
};

export const mealTypes = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
];

export const mealPlans = [
    { value: "all-inclusive", label: "All-Inclusive" },
    { value: "full-board", label: "Full Board" },
    { value: "half-board", label: "Half Board" },
];

export const statuses =[
  {value : "checked-in", label: "Checked In"},
  {value : "checked-out", label: "Checked Out"},
]

export const getCurrentMealType = () => {
  const now = new Date();
  const currentTime = now.toTimeString().split(' ')[0];

  if (currentTime >= MEAL_TIMES.breakfast.start && currentTime <= MEAL_TIMES.breakfast.end) {
    return "breakfast";
  } else if (currentTime >= MEAL_TIMES.lunch.start && currentTime <= MEAL_TIMES.lunch.end) {
    return "lunch";
  } else if (currentTime >= MEAL_TIMES.dinner.start && currentTime <= MEAL_TIMES.dinner.end) {
    return "dinner";
  }
  
  // Return next meal if outside periods
  if (currentTime < MEAL_TIMES.breakfast.start) {
    return "breakfast";
  } else if (currentTime < MEAL_TIMES.lunch.start) {
    return "lunch";
  } else if (currentTime < MEAL_TIMES.dinner.start) {
    return "dinner";
  } else {
    return "breakfast";
  }
};