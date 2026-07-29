import { SweetAlert } from "./sweetalert.js";

export class NutriplanLog {
  Log_Key = "nutriplan_daily_log";
  itemType;

  constructor(type) {
    this.itemType = type;
  }

  prepareMealObj(item) {
    const today = new Date();
    const loggedAt = today.toISOString();
    return {
      type: item.type,
      name: item.name,
      mealId: item.id,
      category: item.category,
      thumbnail: item.thumbnail,
      servings: item.servings,
      nutrition: {
        calories: item.nutrition.calories,
        protein: item.nutrition.protein,
        carbs: item.nutrition.carbs,
        fat: item.nutrition.fat,
        sugar: item.nutrition.sugar,
        fiber: item.nutrition.fiber,
        sodium: item.nutrition.sodium,
      },
      loggedAt: loggedAt,
    };
  }
  prepareProductObj(item) {
    const today = new Date();
    const loggedAt = today.toISOString();
    return {
      type: item.type,
      name: item.name,
      barcode: item.barcode,
      brand: item.brand,
      image: item.image,
      serving: item.serving,
      nutrition: {
        calories: item.nutrition.calories,
        protein: item.nutrition.protein,
        carbs: item.nutrition.carbs,
        fat: item.nutrition.fat,
        sugar: item.nutrition.sugar,
        fiber: item.nutrition.fiber,
        sodium: item.nutrition.sodium,
      },
      loggedAt: loggedAt,
    };
  }

  handleLogMealObj(item) {
    let savedLog = localStorage.getItem(this.Log_Key);
    const logObj = savedLog ? JSON.parse(savedLog) : {};
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    if (!logObj[formattedDate]) {
      logObj[formattedDate] = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
      };
    }

    logObj[formattedDate].totalCalories += item.nutrition.calories;
    logObj[formattedDate].totalProtein += item.nutrition.protein;
    logObj[formattedDate].totalCarbs += item.nutrition.carbs;
    logObj[formattedDate].totalFat += item.nutrition.fat;

    const mealObj =
      this.itemType === "meal"
        ? this.prepareMealObj(item)
        : this.prepareProductObj(item);

    logObj[formattedDate].meals.push(mealObj);

    localStorage.setItem(this.Log_Key, JSON.stringify(logObj));

    if (this.itemType === "meal") {
      SweetAlert.showSuccessAlert({
        title: "Meal Logged!",
        text: `${mealObj.name} (${mealObj.servings} servings) has been added to your daily log.`,
        highlightText: `+${mealObj.nutrition.calories} calories`,
      });
    } else {
      // SweetAlert.showToast("success", "product added successfully!");
      SweetAlert.showSuccessToast("product added successfully!");
    }
  }
}
