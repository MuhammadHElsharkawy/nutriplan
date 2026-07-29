import { MS } from "./meal-service-instance.js";
import { S } from "./shared.js";
import { NutriplanLog } from "./nutriplan-log.js";
import { navigateTo } from "./Router.js";
import { SweetAlert } from "./sweetalert.js";

export class MealDetails {
  meal;
  mealAnalyzed;
  openModalBtn;
  closeModalBtn;
  confirmLogMealBtn;
  logMealModal;
  decreaseServingsBtn;
  increaseServingsBtn;
  mealServingsInput;
  modalCalories;
  modalProtein;
  modalCarbs;
  modalFat;

  NL = new NutriplanLog("meal");

  constructor() {
    this.openModalBtn = document.getElementById("log-meal-btn");
    this.closeModalBtn = document.getElementById("cancel-log-meal");
    this.confirmLogMealBtn = document.getElementById("confirm-log-meal");
    this.logMealModal = document.getElementById("log-meal-modal");
    this.decreaseServingsBtn = document.getElementById("decrease-servings");
    this.increaseServingsBtn = document.getElementById("increase-servings");
    this.mealServingsInput = document.getElementById("meal-servings");
    this.modalCalories = document.getElementById("modal-calories");
    this.modalProtein = document.getElementById("modal-protein");
    this.modalCarbs = document.getElementById("modal-carbs");
    this.modalFat = document.getElementById("modal-fat");
  }

  getIdFromPath(path) {
    const segments = path.split("/").filter(Boolean);
    return segments[segments.length - 1];
  }

  async loadAndDisplay(path) {
    const id = this.getIdFromPath(path);
    S.startpageLoading();
    try {
      this.meal = await MS.Get_Meal_By_ID(id);
      this.Analyze_Meal(meal);
    } catch (error) {
      navigateTo("/home");
      SweetAlert.showErrorToast({
        title: "Something went wrong",
        text: "We couldn't load this recipe. Please try again later.",
      });
      console.error("Couldn't load meal details:", error.message);
    }
    S.stoppageLoading();
  }

  async Analyze_Meal(meal) {
    S.startpageLoading();
    try {
      this.mealAnalyzed = await MS.Analyze_Meal(meal);
    } catch (error) {
      navigateTo("/home");
      SweetAlert.showErrorToast({
        title: "Something went wrong",
        text: "We couldn't load this recipe. Please try again later.",
      });
      console.error("Couldn't load meal analyze:", error.message);
    }
    S.stoppageLoading();
    this.render(meal, this.mealAnalyzed);
  }

  render(meal, mealAnalyzed) {
    this.renderHero(meal);
    this.renderIngredients(meal.ingredients);
    this.renderInstructions(meal.instructions);
    this.renderVideo(meal.youtube);
    this.renderNutritionFacts(mealAnalyzed);
  }

  renderHero(meal) {
    const mealImage = document.getElementById("meal-image");
    mealImage.src = meal.thumbnail;
    mealImage.alt = meal.name;
    let tagsBox = "";
    meal.tags.forEach((tag) => {
      tagsBox += `<span
                        class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">
                        ${tag}
                  </span>
                  `;
    });
    document.getElementById("meal-category-area-tags").innerHTML = `
    <span
        class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
        ${meal.category}
    </span>
    ${
      meal.area
        ? `<span
        class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
        ${meal.area}
    </span>`
        : ""
    }
    ${tagsBox}
    `;
    document.getElementById("meal-name").innerHTML = meal.name;
    document.getElementById("hero-servings").innerHTML =
      `${this.mealAnalyzed.servings} servings`;
    document.getElementById("hero-calories").innerHTML =
      `${this.mealAnalyzed.perServing.calories} cal/serving`;
  }

  renderIngredients(ingredients) {
    document.getElementById("ingredients-count").innerHTML =
      `${ingredients.length} items`;
    let box = "";
    ingredients.forEach((item) => {
      box += `<div
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                    <input type="checkbox"
                    class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                        <span class="text-gray-700">
                        <span class="font-medium text-gray-900">${item.measure}</span>
                        ${item.ingredient}
                        </span>
                </div>
                `;
    });
    document.getElementById("meal-ingredients-grid").innerHTML = box;
  }

  renderInstructions(instructions) {
    let box = "";
    instructions.forEach((item, counter) => {
      box += `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div
            class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                ${counter + 1}
            </div>
            <p class="text-gray-700 leading-relaxed pt-2">
                ${item}
            </p>
        </div>
        `;
    });
    document.getElementById("meal-instructions-grid").innerHTML = box;
  }

  renderVideo(youtubeLink) {
    const section = document.getElementById("meal-video-section");

    if (!youtubeLink) {
      section.classList.add("hidden");
      return;
    }

    section.classList.remove("hidden");

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeLink.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      const embedLink = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;

      document.getElementById("meal-video").innerHTML = `
      <iframe src="${embedLink}"
          class="absolute inset-0 w-full h-full" 
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
      </iframe>`;
    }
  }

  renderNutritionFacts(mealAnalyzed) {
    document.getElementById("nutrition-facts-container").innerHTML = `
      <p class="text-sm text-gray-500 mb-4">Per serving</p>
      <div
        class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
        <p class="text-sm text-gray-600">Calories per serving</p>
        <p class="text-4xl font-bold text-emerald-600">${mealAnalyzed.perServing.calories}</p>
        <p class="text-xs text-gray-500 mt-1">Total: ${mealAnalyzed.totals.calories} cal</p>
      </div>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span class="text-gray-700">Protein</span>
          </div>
          <span class="font-bold text-gray-900">${mealAnalyzed.perServing.protein}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("protein", mealAnalyzed.perServing.protein)}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-gray-700">Carbs</span>
          </div>
          <span class="font-bold text-gray-900">${mealAnalyzed.perServing.carbs}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("carbs", mealAnalyzed.perServing.carbs)}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-purple-500"></div>
            <span class="text-gray-700">Fat</span>
          </div>
          <span class="font-bold text-gray-900">${mealAnalyzed.perServing.fat}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-purple-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("fat", mealAnalyzed.perServing.fat)}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span class="text-gray-700">Fiber</span>
          </div>
          <span class="font-bold text-gray-900">${mealAnalyzed.perServing.fiber}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-orange-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("fiber", mealAnalyzed.perServing.fiber)}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-pink-500"></div>
            <span class="text-gray-700">Sugar</span>
          </div>
          <span class="font-bold text-gray-900">${mealAnalyzed.perServing.sugar}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-pink-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("sugar", mealAnalyzed.perServing.sugar)}%"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span class="text-gray-700">Saturated Fat</span>
          </div>
          <span class="font-bold text-gray-900">${mealAnalyzed.perServing.saturatedFat}g</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div class="bg-red-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("saturatedFat", mealAnalyzed.perServing.saturatedFat)}%"></div>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Cholesterol</span>
              <span class="font-medium">${this.mealAnalyzed.perServing.cholesterol}mg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sodium</span>
              <span class="font-medium">${this.mealAnalyzed.perServing.sodium}mg</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  stopVideo() {
    const videoContainer = document.getElementById("meal-video");
    if (videoContainer) {
      videoContainer.innerHTML = "";
    }
  }

  openLogModal() {
    this.logMealModal.classList.replace("hidden", "flex");
    this.renderModalNutrition();
  }

  closeLogModal() {
    this.logMealModal.classList.replace("flex", "hidden");
  }

  decreaseServings() {
    const currentValue = parseFloat(this.mealServingsInput.value) || 1;
    const min = parseFloat(this.mealServingsInput.min) || 0.5;
    const step = parseFloat(this.mealServingsInput.step) || 0.5;

    if (currentValue - step >= min) {
      this.mealServingsInput.value = currentValue - step;
    }
  }

  increaseServings() {
    const currentValue = parseFloat(this.mealServingsInput.value) || 1;
    const max = parseFloat(this.mealServingsInput.max) || 10;
    const step = parseFloat(this.mealServingsInput.step) || 0.5;

    if (currentValue + step <= max) {
      this.mealServingsInput.value = currentValue + step;
    }
  }

  renderModalNutrition() {
    this.modalCalories.innerHTML = this.mealAnalyzed.perServing.calories;
    this.modalProtein.innerHTML = `${this.mealAnalyzed.perServing.protein}g`;
    this.modalCarbs.innerHTML = `${this.mealAnalyzed.perServing.carbs}g`;
    this.modalFat.innerHTML = `${this.mealAnalyzed.perServing.fat}g`;
  }

  prepareLogMealObj() {
    return {
      type: "meal",
      name: this.meal.name,
      id: this.meal.id,
      category: this.meal.category,
      thumbnail: this.meal.thumbnail,
      servings: this.mealServingsInput.value,
      nutrition: {
        calories:
          this.mealServingsInput.value * this.mealAnalyzed.perServing.calories,
        protein:
          this.mealServingsInput.value * this.mealAnalyzed.perServing.protein,
        carbs:
          this.mealServingsInput.value * this.mealAnalyzed.perServing.carbs,
        fat: this.mealServingsInput.value * this.mealAnalyzed.perServing.fat,
        sugar:
          this.mealServingsInput.value * this.mealAnalyzed.perServing.sugar,
        fiber:
          this.mealServingsInput.value * this.mealAnalyzed.perServing.fiber,
        sodium:
          this.mealServingsInput.value * this.mealAnalyzed.perServing.sodium,
      },
    };
  }

  init() {
    document
      .getElementById("back-to-meals-btn")
      .addEventListener("click", () => {
        navigateTo("/home");
      });

    this.openModalBtn.addEventListener("click", () => this.openLogModal());
    this.closeModalBtn.addEventListener("click", () => this.closeLogModal());
    this.logMealModal.addEventListener("click", (event) => {
      if (event.target === this.logMealModal) this.closeLogModal();
    });

    this.decreaseServingsBtn.addEventListener("click", () => {
      this.decreaseServings();
    });
    this.increaseServingsBtn.addEventListener("click", () => {
      this.increaseServings();
    });

    this.confirmLogMealBtn.addEventListener("click", () => {
      const obj = this.prepareLogMealObj();
      this.NL.handleLogMealObj(obj);
      this.closeLogModal();
    });

    document.addEventListener("page-changed", (event) => {
      const { pageId, path, state } = event.detail;
      if (pageId !== "meal") return;

      if (state?.meal) {
        this.meal = state.meal;
        this.Analyze_Meal(this.meal);
      } else this.loadAndDisplay(path);
    });

    document.addEventListener("before-navigate", () => this.stopVideo());
  }
}
