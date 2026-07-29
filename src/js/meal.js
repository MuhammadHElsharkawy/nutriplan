import { MS } from "./meal-service-instance.js";
import { S } from "./shared.js";
import { slugify } from "./utils.js";
import { navigateTo } from "./router.js";

export class Meal {
  mealsList;

  async getMealsArray(silent = false) {
    if (!silent) S.startMealsLoading();
    try {
      const type = S.selectedMealFilterType;
      const value = S.selectedMealFilterValue;
      if ((type === "area" || type === "category") && value)
        this.mealsList = await MS.Filter_Meals_By(type, value);
      else if (S.mealSearchName)
        this.mealsList = await MS.Search_Meals_By_Name(S.mealSearchName);
      else this.mealsList = await MS.Get_Random_Meals();
    } catch (error) {
      console.error("Couldn't load meals:", error.message);
    }
    if (!silent) S.stopMealsLoading();
    this.display();
  }

  async display() {
    const container = document.getElementById("recipes-grid");
    document.getElementById("recipes-count").innerHTML =
      `Showing ${this.mealsList.length} recipes`;
    let box = ``;
    const isListView = S.selectedMealView === "list";

    isListView
      ? (container.classList = "grid grid-cols-1 sm:grid-cols-2 gap-4")
      : (container.classList =
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5");

    if (this.mealsList.length === 0) {
      box = `
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-500 text-lg">No recipes found</p>
            <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
        </div>
      `;
    } else {
      this.mealsList.forEach((meal) => {
        box += `
            <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group ${isListView ? "flex flex-row h-40" : ""}"
            data-meal-id="${meal.id}">
                <div class="relative ${isListView ? "w-48 h-full" : "h-48"} overflow-hidden">
                    <img class="${isListView ? "max-w-full" : "w-full"} h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src="${meal.thumbnail}"
                        alt="${meal.name}" loading="lazy" />
                    <div class="absolute bottom-3 left-3 flex gap-2 ${isListView ? "hidden" : ""}">
                        <span
                            class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                            ${meal.category}
                        </span>
                        ${
                          meal.area
                            ? `<span
                            class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                            ${meal.area}
                        </span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="p-4 shrink-0">
                    <h3
                        class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1 wrap-break-word">
                        ${meal.name}
                    </h3>
                    <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                        Delicious recipe to try!
                    </p>
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-semibold text-gray-900">
                            <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                            ${meal.category}
                        </span>
                        <span class="font-semibold text-gray-500">
                            <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                            ${meal.area ? `${meal.area}` : "International"}
                        </span>
                    </div>
                </div>
            </div>
          `;
      });
    }

    container.innerHTML = box;
  }

  async changeDisplayView() {
    const btns = document.querySelectorAll("button[data-view]");
    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        btns.forEach((i) => {
          i.classList.remove("bg-white");
          i.classList.remove("shadow-sm");
        });
        btn.classList.add("bg-white");
        btn.classList.add("shadow-sm");
        if (btn.dataset.view === "grid") S.selectedMealView = "grid";
        else if (btn.dataset.view === "list") S.selectedMealView = "list";
        document.dispatchEvent(new CustomEvent("view-changed"));
      });
    });
  }

  initCardClicks() {
    document
      .getElementById("recipes-grid")
      .addEventListener("click", (event) => {
        const card = event.target.closest("[data-meal-id]");
        if (!card) return;

        const id = card.dataset.mealId;
        const meal = this.mealsList.find((m) => String(m.id) === id);
        if (!meal) return;

        const slug = slugify(meal.name);
        navigateTo(`/meal/${slug}/${id}`, { meal });
      });
  }

  init() {
    document.addEventListener("filter-changed", () => this.getMealsArray());
    document.addEventListener("view-changed", () => this.display());
  }
}
