import { MS } from "./meal-service-instance.js";
import { S } from "./shared.js";

export class Area {
  async display() {
    S.startLoading();
    try {
      const areaList = await MS.Get_All_Areas();
      const container = document.getElementById("Cuisines-Container");
      let box = `
      <button id='all-cuisines-btn'
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap transition-all cuisines-active" data-area="">
          All Cuisines
      </button>`;
      areaList.forEach((area) => {
        box += `
          <button
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            data-area="${area.name}">
              ${area.name}
          </button>`;
      });
      container.innerHTML = box;
    } catch (error) {
      console.error("Couldn't load areas:", error.message);
    }
    S.stopLoading();
    S.handleLoading();
  }

  getArea() {
    document
      .getElementById("Cuisines-Container")
      .addEventListener("click", (event) => {
        const button = event.target.closest("button[data-area]");
        if (button) {
          S.searchName = "";
          document.getElementById("search-input").value = "";
          S.selectedMealFilterType = "area";
          S.selectedMealFilterValue = button.dataset.area;
          document.dispatchEvent(new CustomEvent("filter-changed"));
        }
      });
    document.addEventListener("filter-changed", () => {
      const allCuisinesBtn = document.getElementById("all-cuisines-btn");
      if (
        S.selectedMealFilterValue === "" ||
        S.selectedMealFilterType !== "area"
      ) {
        document.querySelectorAll("button[data-area]").forEach((btn) => {
          btn.classList.remove("cuisines-active");
        });
        allCuisinesBtn?.classList.add("cuisines-active");
      } else {
        document.querySelectorAll("button[data-area]").forEach((btn) => {
          btn.classList.toggle(
            "cuisines-active",
            S.selectedMealFilterType === "area" &&
              btn.dataset.area === S.selectedMealFilterValue,
          );
        });
      }
    });
  }
}
