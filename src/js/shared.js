class Shared {
  loadingCount = 0;
  mealsLoading = false;
  pageLoading = 0;

  dailyGoals = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 78,
    fiber: 28,
    sugar: 50,
    saturatedFat: 20,
  };

  getProgressPercentage(type, value) {
    const percentage = Math.round((value / this.dailyGoals[type]) * 100);
    return Math.min(percentage, 100);
  }

  startLoading() {
    this.loadingCount++;
    this.handleLoading();
  }

  stopLoading() {
    this.loadingCount--;
    this.handleLoading();
  }

  handleLoading() {
    const isLoading = this.loadingCount > 0;
    const loading = document.getElementById("app-loading-overlay");
    loading.classList.toggle("opacity-0", !isLoading);
    loading.classList.toggle("opacity-100", isLoading);
    loading.classList.toggle("invisible", !isLoading);
    loading.classList.toggle("visible", isLoading);
  }

  startMealsLoading() {
    this.mealsLoading = true;
    this.handleMealsLoading();
  }

  stopMealsLoading() {
    this.mealsLoading = false;
    this.handleMealsLoading();
  }

  handleMealsLoading() {
    const recipesGrid = document.getElementById("recipes-grid");
    this.mealsLoading
      ? (recipesGrid.innerHTML = `<div class="flex items-center justify-center py-12">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        </div>`)
      : (recipesGrid.innerHTML = "");
  }

  startpageLoading() {
    this.pageLoading++;
    this.handlepageLoading();
  }

  stoppageLoading() {
    this.pageLoading--;
    this.handlepageLoading();
  }

  handlepageLoading() {
    const isLoading = this.pageLoading > 0;
    const loading = document.getElementById("page-loading-overlay");
    loading.classList.toggle("hidden", !isLoading);
    loading.classList.toggle("flex", isLoading);
  }

  selectedMealFilterType = "";
  selectedMealFilterValue = "";
  mealSearchName = "";
  selectedMealView = "grid";
}

export const S = new Shared();
