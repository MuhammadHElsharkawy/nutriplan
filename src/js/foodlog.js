import { S } from "./shared.js";
import { SweetAlert } from "./sweetalert.js";

export class FoodLog {
  Log_Key = "nutriplan_daily_log";

  getTodayKey() {
    return new Date().toISOString().split("T")[0];
  }

  getTodayData() {
    const savedLog = localStorage.getItem(this.Log_Key);
    const logObj = savedLog ? JSON.parse(savedLog) : {};
    return (
      logObj[this.getTodayKey()] || {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
      }
    );
  }

  getTodayTotals() {
    const todayEntry = this.getTodayData();

    return {
      totalCalories: todayEntry?.totalCalories ?? 0,
      totalProtein: todayEntry?.totalProtein ?? 0,
      totalCarbs: todayEntry?.totalCarbs ?? 0,
      totalFat: todayEntry?.totalFat ?? 0,
    };
  }

  renderNutritionBars() {
    const totals = this.getTodayTotals();

    const nutrients = [
      {
        key: "totalCalories",
        goalKey: "calories",
        unit: "kcal",
        prefix: "calories",
      },
      { key: "totalProtein", goalKey: "protein", unit: "g", prefix: "protein" },
      { key: "totalCarbs", goalKey: "carbs", unit: "g", prefix: "carbs" },
      { key: "totalFat", goalKey: "fat", unit: "g", prefix: "fat" },
    ];

    nutrients.forEach(({ key, goalKey, unit, prefix }) => {
      const value = totals[key];
      const goal = S.dailyGoals[goalKey];
      const percentage = S.getProgressPercentage(goalKey, value);

      const barElem = document.getElementById(`${prefix}-progress-bar`);
      const valueElem = document.getElementById(`${prefix}-progress-value`);
      const percentageElem = document.getElementById(
        `${prefix}-progress-percentage`,
      );

      if (valueElem) {
        valueElem.classList.remove("text-red-500");
        valueElem.textContent = `${value.toFixed(2)} ${unit}`;
      }
      if (barElem) {
        barElem.classList.remove("bg-red-500");
        barElem.style.width = `${percentage}%`;
      }
      if (percentageElem) {
        percentageElem.classList.remove("text-red-500");
        percentageElem.textContent = `${percentage}%`;
      }
      if (percentage >= 100) {
        barElem.classList.add("bg-red-500");
        valueElem.classList.add("text-red-500");
        percentageElem.classList.add("text-red-500");
      }
    });
  }

  renderLoggedItems() {
    const todayData = this.getTodayData();
    const items = todayData.meals || [];
    const container = document.getElementById("logged-items-list");
    const countElem = document.getElementById("logged-items-count");
    const clearBtn = document.getElementById("clear-foodlog");

    if (countElem) countElem.textContent = `Logged Items (${items.length})`;

    if (!container) return;

    if (items.length === 0) {
      if (clearBtn) clearBtn.classList.add("hidden");
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
            <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
            <p class="font-medium">No meals logged today</p>
            <p class="text-sm">
                Add meals from the Meals page or scan products
            </p>
        </div>
      `;
      return;
    }

    if (clearBtn) clearBtn.classList.remove("hidden");

    let html = "";
    items.forEach((item, index) => {
      const isMeal = item.type === "meal";
      const timeFormatted = item.loggedAt
        ? new Date(item.loggedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const imageBox =
        item.thumbnail || item.image
          ? `<img loading="lazy" src="${item.thumbnail || item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover" />`
          : `<div class="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-xl"><i class="fa-solid fa-box"></i></div>`;

      const subtitle = isMeal
        ? `${item.servings || 1} serving • <span class="text-emerald-600 font-medium">Recipe</span>`
        : `${item.brand || "Product"} • <span class="text-blue-600 font-medium">Product</span>`;

      html += `
        <div class="flex items-center justify-between p-4 bg-white rounded-2xl shadow-xs border border-gray-100 hover:shadow-md transition-all">
          <div class="flex items-center gap-3">
            ${imageBox}
            <div>
              <h4 class="font-bold text-gray-900 text-sm md:text-base">${item.name}</h4>
              <p class="text-xs text-gray-500">${subtitle}</p>
              <p class="text-[11px] text-gray-400 mt-0.5">${timeFormatted}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="text-lg font-bold text-emerald-600">${Math.round(item.nutrition.calories)}</span>
              <span class="text-xs text-gray-400 block -mt-1">kcal</span>
            </div>

            <div class="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
              <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">${Math.round(item.nutrition.protein)}g P</span>
              <span class="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg">${Math.round(item.nutrition.carbs)}g C</span>
              <span class="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg">${Math.round(item.nutrition.fat)}g F</span>
            </div>

            <button data-logged-at="${item.loggedAt}" class="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer" title="Delete">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderWeeklyOverview() {
    const savedLog = localStorage.getItem(this.Log_Key);
    const logObj = savedLog ? JSON.parse(savedLog) : {};

    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const dayData = logObj[dateKey] || { totalCalories: 0, meals: [] };

      days.push({
        dateKey,
        dayName: dayNames[d.getDay()],
        dayNum: d.getDate(),
        isToday: i === 0,
        calories: Math.round(dayData.totalCalories || 0),
        itemsCount: dayData.meals ? dayData.meals.length : 0,
      });
    }

    const weeklyContainer = document.getElementById("weekly-chart");
    if (weeklyContainer) {
      weeklyContainer.innerHTML = days
        .map(
          (day) => `
        <div class="text-center ${
          day.isToday ? "bg-indigo-100 rounded-xl" : ""
        }">
          <p class="text-xs text-gray-500 mb-1">${day.dayName}</p>
          <p class="text-sm font-medium text-gray-900">${day.dayNum}</p>
          <div class="mt-2 ${day.calories > 0 ? "text-emerald-600" : "text-gray-300"}">
                <p class="text-lg font-bold ${day.calories > 0 ? "text-emerald-600" : ""}">${day.calories}</p>
                <p class="text-xs">kcal</p>
        </div>
        ${day.itemsCount > 0 ? `<p class="text-xs text-gray-400 mt-1">${day.itemsCount} items</p>` : ""}
        </div>
        `,
        )
        .join("");
    }

    const totalWeeklyCals = days.reduce((acc, d) => acc + d.calories, 0);
    const totalWeeklyItems = days.reduce((acc, d) => acc + d.itemsCount, 0);
    const avgCals = Math.round(totalWeeklyCals / 7);
    const activeDays = days.filter(
      (d) =>
        d.calories >= S.dailyGoals["calories"] * 0.9 &&
        d.calories <= S.dailyGoals["calories"] * 1.1,
    ).length;

    const avgElem = document.getElementById("weekly-average-kcal");
    const itemsElem = document.getElementById("total-weekly-items");
    const daysElem = document.getElementById("days-on-goal");

    if (avgElem) avgElem.textContent = `${avgCals} kcal`;
    if (itemsElem) itemsElem.textContent = `${totalWeeklyItems} items`;
    if (daysElem) daysElem.textContent = `${activeDays} / 7`;
  }

  deleteItem(loggedAt) {
    const savedLog = localStorage.getItem(this.Log_Key);
    if (!savedLog) return;

    const logObj = JSON.parse(savedLog);
    const todayKey = this.getTodayKey();
    const todayEntry = logObj[todayKey];

    if (!todayEntry) return;

    const index = todayEntry.meals.findIndex((m) => m.loggedAt === loggedAt);
    if (index === -1) return;

    const item = todayEntry.meals[index];
    todayEntry.totalCalories = Math.max(
      0,
      todayEntry.totalCalories - item.nutrition.calories,
    );
    todayEntry.totalProtein = Math.max(
      0,
      todayEntry.totalProtein - item.nutrition.protein,
    );
    todayEntry.totalCarbs = Math.max(
      0,
      todayEntry.totalCarbs - item.nutrition.carbs,
    );
    todayEntry.totalFat = Math.max(0, todayEntry.totalFat - item.nutrition.fat);

    todayEntry.meals.splice(index, 1);

    localStorage.setItem(this.Log_Key, JSON.stringify(logObj));
    this.refreshUI();
  }

  clearAllToday() {
    const savedLog = localStorage.getItem(this.Log_Key);
    if (!savedLog) return;

    const logObj = JSON.parse(savedLog);
    const todayKey = this.getTodayKey();

    if (logObj[todayKey]) {
      logObj[todayKey] = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
      };
      localStorage.setItem(this.Log_Key, JSON.stringify(logObj));
    }

    this.refreshUI();
  }

  refreshUI() {
    this.renderNutritionBars();
    this.renderLoggedItems();
    this.renderWeeklyOverview();
  }

  initEvents() {
    const listContainer = document.getElementById("logged-items-list");
    if (listContainer) {
      listContainer.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest("[data-logged-at]");
        if (deleteBtn) {
          const result = await SweetAlert.showConfirmDialog(
            "Delete this item?",
            "This will delete this item forever.",
            "Yes, delete it!",
          );
          if (result.isConfirmed) {
            const loggedAt = deleteBtn.dataset.loggedAt;
            this.deleteItem(loggedAt);
          }
        }
      });
    }

    const clearBtn = document.getElementById("clear-foodlog");
    if (clearBtn) {
      clearBtn.addEventListener("click", async () => {
        const result = await SweetAlert.showConfirmDialog(
          "Clear Today's Log?",
          "This will remove all logged food items for today.",
          "Yes, clear it!",
        );
        if (result.isConfirmed) this.clearAllToday();
      });
    }
  }

  init() {
    this.initEvents();

    document.addEventListener("page-changed", (event) => {
      if (event.detail.pageId !== "foodlog") return;
      this.refreshUI();
    });
  }
}
