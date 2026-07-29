import { S } from "./shared.js";

export class Search {
  debounceTimer;

  getSearchName() {
    document
      .getElementById("search-input")
      .addEventListener("input", (event) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          S.mealSearchName = event.target.value;
          S.selectedMealFilterType = "";
          S.selectedMealFilterValue = "";
          document.dispatchEvent(new CustomEvent("filter-changed"));
        }, 400);
      });
  }
}
