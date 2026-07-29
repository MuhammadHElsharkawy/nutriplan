import { MS } from "./meal-service-instance.js";
import { S } from "./shared.js";

export class Category {
  style = {
    Beef: {
      bgColor: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
      hover: "hover:border-red-400",
      icon: "fa-drumstick-bite",
      iconBg: "from-red-400 to-rose-500",
    },
    Chicken: {
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      hover: "hover:border-amber-400",
      icon: "fa-drumstick-bite",
      iconBg: "from-amber-400 to-orange-500",
    },
    Dessert: {
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      hover: "hover:border-pink-400",
      icon: "fa-cake-candles",
      iconBg: "from-pink-400 to-rose-500",
    },
    Lamb: {
      bgColor: "from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
      hover: "hover:border-orange-400",
      icon: "fa-drumstick-bite",
      iconBg: "from-orange-400 to-amber-500",
    },
    Miscellaneous: {
      bgColor: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200",
      hover: "hover:border-slate-400",
      icon: "fa-bowl-rice",
      iconBg: "from-slate-400 to-gray-500",
    },
    Pasta: {
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      hover: "hover:border-yellow-400",
      icon: "fa-bowl-food",
      iconBg: "from-yellow-400 to-amber-500",
    },
    Pork: {
      bgColor: "from-rose-50 to-red-50",
      borderColor: "border-rose-200",
      hover: "hover:border-rose-400",
      icon: "fa-bacon",
      iconBg: "from-rose-400 to-red-500",
    },
    Seafood: {
      bgColor: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200",
      hover: "hover:border-cyan-400",
      icon: "fa-fish",
      iconBg: "from-cyan-400 to-blue-500",
    },
    Side: {
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      hover: "hover:border-green-400",
      icon: "fa-plate-wheat",
      iconBg: "from-green-400 to-emerald-500",
    },
    Starter: {
      bgColor: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-200",
      hover: "hover:border-teal-400",
      icon: "fa-utensils",
      iconBg: "from-teal-400 to-cyan-500",
    },
    Vegan: {
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      hover: "hover:border-emerald-400",
      icon: "fa-leaf",
      iconBg: "from-emerald-400 to-green-500",
    },
    Vegetarian: {
      bgColor: "from-lime-50 to-green-50",
      borderColor: "border-lime-200",
      hover: "hover:border-lime-400",
      icon: "fa-seedling",
      iconBg: "from-lime-400 to-green-500",
    },
    Breakfast: {
      bgColor: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200",
      hover: "hover:border-orange-400",
      icon: "fa-mug-hot",
      iconBg: "from-orange-400 to-yellow-500",
    },
    Goat: {
      bgColor: "from-stone-50 to-orange-50",
      borderColor: "border-stone-200",
      hover: "hover:border-stone-400",
      icon: "fa-hippo",
      iconBg: "from-stone-400 to-orange-600",
    },
  };

  async display() {
    S.startLoading();
    try {
      const categoriesList = await MS.Get_All_Categories();
      const container = document.getElementById("categories-grid");
      let box = ``;

      categoriesList.forEach((category) => {
        const cardStyle = this.style[category.name] || {
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-200",
          hover: "hover:border-gray-400",
          icon: "fa-utensils",
          iconBg: "from-gray-400 to-slate-500",
        };

        box += `
            <button class="category-card bg-linear-to-br ${cardStyle.bgColor} rounded-xl p-3 border ${cardStyle.borderColor} ${cardStyle.hover} hover:shadow-md cursor-pointer transition-all group"
                data-category="${category.name}">
                <div class="flex items-center gap-2.5">
                    <div
                        class="text-white w-9 h-9 bg-linear-to-br ${cardStyle.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <i class="fa-solid ${cardStyle.icon}"></i>
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-gray-900">${category.name}</h3>
                    </div>
                </div>
            </button>`;
      });
      container.innerHTML = box;
    } catch (error) {
      console.error("Couldn't load categories:", error.message);
    }
    S.stopLoading();
    S.handleLoading();
  }

  getCategory() {
    document
      .getElementById("categories-grid")
      .addEventListener("click", (event) => {
        const button = event.target.closest("button[data-category]");
        if (button) {
          S.searchName = "";
          document.getElementById("search-input").value = "";
          S.selectedMealFilterType = "category";
          S.selectedMealFilterValue = button.dataset.category;
          document.dispatchEvent(new CustomEvent("filter-changed"));
        }
      });
    document.addEventListener("filter-changed", () => {
      document.querySelectorAll("button[data-category]").forEach((btn) => {
        btn.classList.toggle(
          "category-active",
          S.selectedMealFilterType === "category" &&
            btn.dataset.category === S.selectedMealFilterValue,
        );
      });
    });
  }
}
