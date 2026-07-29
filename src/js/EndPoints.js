const BASE_URL = "https://nutriplan-api.vercel.app/api";

export const ENDPOINTS = {
  // MEALS ENDPOINTS
  MEALS: {
    Search_Meals_By_Name: (meal_name) =>
      `${BASE_URL}/meals/search?q=${meal_name}`,
    Filter_Meals_By: (filter_by, value) =>
      `${BASE_URL}/meals/filter?${filter_by}=${value}`,
    Get_Meal_By_ID: (meal_id) => `${BASE_URL}/meals/${meal_id}`,
    Get_Random_Meals: `${BASE_URL}/meals/random?count=25`,
    Get_All_Categories: `${BASE_URL}/meals/categories`,
    Get_All_Areas: `${BASE_URL}/meals/areas`,
  },

  // NUTRITION ENDPOINTS
  Analyze_Recipe_Nutrition: `${BASE_URL}/nutrition/analyze`,

  // PRODUCTS ENDPOINTS
  PRODUCTS: {
    Get_All_Product_Categories: `${BASE_URL}/products/categories?page=1&limit=10`,
    Get_Products_By_Category: (product_category) =>
      `${BASE_URL}/products/category/${product_category}`,
    Get_Products_By_Name: (product_name) =>
      `${BASE_URL}/products/search?q=${product_name}`,
    Get_Product_By_Barcode: (barcode) =>
      `${BASE_URL}/products/barcode/${barcode}`,
  },
};
