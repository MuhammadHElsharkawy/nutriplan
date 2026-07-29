import { ENDPOINTS } from "./EndPoints.js";

export class MealService {
  async Get_All_Areas() {
    const response = await fetch(ENDPOINTS.MEALS.Get_All_Areas);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch areas: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.results;
  }

  async Get_All_Categories() {
    const response = await fetch(ENDPOINTS.MEALS.Get_All_Categories);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.results;
  }

  async Get_Random_Meals() {
    const response = await fetch(ENDPOINTS.MEALS.Get_Random_Meals);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch meals: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.results;
  }

  async Filter_Meals_By(type, value) {
    const response = await fetch(ENDPOINTS.MEALS.Filter_Meals_By(type, value));
    if (!response.ok) {
      throw new Error(
        `Failed to fetch meals: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.results;
  }

  async Search_Meals_By_Name(name) {
    const response = await fetch(ENDPOINTS.MEALS.Search_Meals_By_Name(name));
    if (!response.ok) {
      throw new Error(
        `Failed to fetch meals: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.results;
  }

  async Analyze_Meal(meal) {
    const formattedIngredients = meal.ingredients.map((item) => {
      return `${item.measure} ${item.ingredient}`;
    });
    let response = await fetch(ENDPOINTS.Analyze_Recipe_Nutrition, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "QQsFer5gTRQqPFErrgasmsuXywCkcBXe3YjolwaR",
      },
      body: JSON.stringify({
        recipeName: meal.name,
        ingredients: formattedIngredients,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch meals: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.data;
  }
}
