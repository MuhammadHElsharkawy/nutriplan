import { PS } from "./product-service-instance.js";
import { S } from "./shared.js";
import { NutriplanLog } from "./nutriplan-log.js";

export class Products {
  categoriesList;
  productsList;
  filteredLis;
  productDetails;
  productName;
  productCategory;
  productbarcode;
  productSearchInput;
  productSearchByNameBtn;
  productBarcodeInput;
  productSearchByBarcodeBtn;
  productsGrid;
  productsEmpty;
  productLogModal;
  closeProductModalBtns;
  addProductToLogBtn;
  nutriScoreFilter;
  nutriScoreValue;

  NL = new NutriplanLog("product");

  constructor() {
    this.productsGrid = document.getElementById("products-grid");
    this.productsEmpty = document.getElementById("products-empty");
    this.productSearchInput = document.getElementById("product-search-input");
    this.productSearchByNameBtn = document.getElementById("search-product-btn");
    this.productBarcodeInput = document.getElementById("barcode-input");
    this.productSearchByBarcodeBtn =
      document.getElementById("lookup-barcode-btn");
    this.productLogModal = document.getElementById("product-detail-modal");
    this.closeProductModalBtns = document.querySelectorAll(
      ".close-product-modal",
    );
    this.addProductToLogBtn = document.getElementById("add-product-to-log");
    this.nutriScoreFilter = document.querySelectorAll(".nutri-score-filter");
  }

  NutriScore = {
    a: {
      bg: "bg-green-500",
      description: "Excellent",
    },
    b: {
      bg: "bg-lime-500",
      description: "Good",
    },
    c: {
      bg: "bg-yellow-500",
      description: "Average",
    },
    d: {
      bg: "bg-orange-500",
      description: "Poor",
    },
    e: {
      bg: "bg-red-500",
      description: "Bad",
    },
    unknown: {
      bg: "bg-gray-400",
      description: "unknown",
    },
  };

  categoriesStyle = {
    snacks: {
      bg: "from-purple-500 to-pink-500",
      fontAwesome: "fa-cookie-bite",
    },
    beverages: {
      bg: "from-blue-500 to-cyan-500",
      fontAwesome: "fa-glass-water",
    },
    dairies: {
      bg: "from-sky-400 to-blue-500",
      fontAwesome: "fa-cow",
    },
    yogurts: {
      bg: "from-pink-400 to-rose-400",
      fontAwesome: "fa-bowl-rice",
    },
    chocolates: {
      bg: "from-amber-800 to-amber-600",
      fontAwesome: "fa-box-tissue",
    },
    biscuits: {
      bg: "from-yellow-600 to-amber-500",
      fontAwesome: "fa-cookie",
    },
    "ice-creams": {
      bg: "from-fuchsia-500 to-pink-400",
      fontAwesome: "fa-ice-cream",
    },
    "breakfast-cereals": {
      bg: "from-amber-500 to-orange-500",
      fontAwesome: "fa-wheat-awn",
    },
    breads: {
      bg: "from-amber-600 to-yellow-500",
      fontAwesome: "fa-bread-slice",
    },
    cheeses: {
      bg: "from-yellow-400 to-amber-400",
      fontAwesome: "fa-cheese",
    },
  };

  filterByNutriScore() {
    this.filteredLis = this.productsList.filter(
      (item) => item.nutritionGrade === this.nutriScoreValue,
    );
    if (this.nutriScoreValue) this.display(this.filteredLis);
    else this.display(this.productsList);
  }

  async getProductCategories() {
    try {
      this.categoriesList = await PS.Get_All_Product_Categories();
    } catch (error) {
      console.error("Couldn't load categories:", error.message);
    }
    this.displayCategories();
  }

  displayCategories() {
    let box = "";

    this.categoriesList.forEach((ele) => {
      box += `
      <button class="product-category-btn shrink-0 px-5 py-3 bg-linear-to-r ${this.categoriesStyle[ele.id].bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        data-category="${ele.id}">
        <i class="fa-solid ${this.categoriesStyle[ele.id].fontAwesome}"></i>
        ${ele.name}
      </button>
      `;
    });

    document.getElementById("product-categories").innerHTML = box;
  }

  async getProductsByCategory() {
    this.startProductsLoading();
    try {
      this.productsList = await PS.Get_Products_By_Category(
        this.productCategory,
      );
    } catch (error) {
      console.error("Couldn't load products:", error.message);
    }
    this.stopProductsLoading();
    this.display(this.productsList);
  }

  async getProductsByName() {
    this.startProductsLoading();
    try {
      this.productsList = await PS.Get_Products_By_Name(this.productName);
    } catch (error) {
      console.error("Couldn't load products:", error.message);
    }
    this.stopProductsLoading();
    this.display(this.productsList);
  }

  async getProductByBarcode() {
    this.startProductsLoading();
    try {
      this.productsList = await PS.Get_Product_By_Barcode(this.productbarcode);
    } catch (error) {
      console.error("Couldn't load products:", error.message);
    }
    this.stopProductsLoading();
    this.display(this.productsList);
  }

  display(list) {
    let box = "";

    list = Array.isArray(list) ? list : [list];

    if (list.length === 0) {
      this.productsEmpty.classList.remove("hidden");
    } else {
      this.productsEmpty.classList.add("hidden");
      list.forEach((product) => {
        box += `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-barcode="${product.barcode}">
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${product.image}"
                    alt="${product.name}" loading="lazy" />
                ${`<div
                    class="absolute top-2 left-2 
                    ${this.NutriScore[product.nutritionGrade].bg || this.NutriScore.unknown.bg} 

                    text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    Nutri-Score ${product.nutritionGrade !== "unknown" ? `${product.nutritionGrade}` : "NOT-APPLICABLE"}
                </div>`}
                ${
                  product.novaGroup
                    ? `<div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA 2">
                    ${product.novaGroup}
                </div>`
                    : ""
                }
            </div>
            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                    ${product.brand}
                </p>
                <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${product.name}
                </h3>
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span><i class="fa-solid fa-weight-scale mr-1"></i>250g</span>
                    <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(product.nutrients.calories)} kcal/100g</span>
                </div>
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${Math.round(product.nutrients.protein)}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${Math.round(product.nutrients.carbs)}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${Math.round(product.nutrients.fat)}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${Math.round(product.nutrients.sugar)}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
        `;
      });
      this.productsGrid.innerHTML = box;
    }
  }

  startProductsLoading() {
    this.productsGrid.innerHTML = "";
    this.productsEmpty.classList.add("hidden");
    this.productsLoading = true;
    this.handleProductsLoading();
  }
  stopProductsLoading() {
    this.productsLoading = false;
    this.handleProductsLoading();
  }
  handleProductsLoading() {
    const productsLoadingDiv = document.getElementById("products-loading");
    productsLoadingDiv.classList.toggle("hidden", !this.productsLoading);
  }

  openProductLogModal() {
    this.productLogModal.classList.replace("hidden", "flex");
  }
  closeProductLogModal() {
    this.productLogModal.classList.replace("flex", "hidden");
  }

  renderProductLogModal(product) {
    this.renderLogHeader(product);
    this.renderLogNutrition(product);
  }
  renderLogHeader(product) {
    const logImage = document.getElementById("product-log-image");
    logImage.src = product.image;
    logImage.alt = product.name;
    document.getElementById("product-log-header").innerHTML = `
        <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand}</p>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
        <p class="text-sm text-gray-500 mb-3">350 g</p>
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style="background-color: #e63e1120">
                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold uppercase"
                    style="background-color: #e63e11">
                    ${product.nutritionGrade === "unknown" ? "?" : product.nutritionGrade}
                </span>
                <div>
                    <p class="text-xs font-bold" style="color: #e63e11">Nutri-Score</p>
                    <p class="text-[10px] text-gray-600">${this.NutriScore[product.nutritionGrade].description || this.NutriScore.unknown.description}</p>
                </div>
            </div>
        </div>
    `;
  }
  renderLogNutrition(product) {
    document.getElementById("product-log-nutrition").innerHTML = `
        <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="text-emerald-600 fa-sollid fa-chart-pie"></i>
            Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
        </h3>
        <div class="text-center mb-4 pb-4 border-b border-emerald-200">
            <p class="text-4xl font-bold text-gray-900">${Math.round(product.nutrients.calories)}</p>
            <p class="text-sm text-gray-500">Calories</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("protein", product.nutrients.protein)}%"></div>
                </div>
                <p class="text-lg font-bold text-emerald-600">${Math.round(product.nutrients.protein)}g</p>
                <p class="text-xs text-gray-500">Protein</p>
            </div>
            <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("carbs", product.nutrients.carbs)}%"></div>
                </div>
                <p class="text-lg font-bold text-blue-600">${Math.round(product.nutrients.carbs)}g</p>
                <p class="text-xs text-gray-500">Carbs</p>
            </div>
            <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("fat", product.nutrients.fat)}%"></div>
                </div>
                <p class="text-lg font-bold text-purple-600">${Math.round(product.nutrients.fat)}g</p>
                <p class="text-xs text-gray-500">Fat</p>
            </div>
            <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${S.getProgressPercentage("sugar", product.nutrients.sugar)}%"></div>
                </div>
                <p class="text-lg font-bold text-orange-600">${Math.round(product.nutrients.sugar)}g</p>
                <p class="text-xs text-gray-500">Sugar</p>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
            <div class="text-center">
                <p class="text-sm font-semibold text-gray-900">${Math.round(product.nutrients.sodium)}g</p>
                <p class="text-xs text-gray-500">Sodium</p>
            </div>
            <div class="text-center">
                <p class="text-sm font-semibold text-gray-900">${Math.round(product.nutrients.fiber)}g</p>
                <p class="text-xs text-gray-500">Fiber</p>
            </div>
        </div>
    `;
  }

  prepareLogProductObj() {
    return {
      type: "product",
      name: this.productDetails.name,
      barcode: this.productDetails.barcode,
      brand: this.productDetails.brand,
      image: this.productDetails.image,
      serving: "100g",
      nutrition: {
        calories: this.productDetails.nutrients.calories,
        protein: this.productDetails.nutrients.protein,
        carbs: this.productDetails.nutrients.carbs,
        fat: this.productDetails.nutrients.fat,
        sugar: this.productDetails.nutrients.sugar,
        fiber: this.productDetails.nutrients.fiber,
        sodium: this.productDetails.nutrients.sodium,
      },
    };
  }

  init() {
    this.getProductCategories();

    this.productSearchInput.addEventListener("input", (event) => {
      this.productName = event.target.value;
    });

    this.productSearchByNameBtn.addEventListener("click", () => {
      if (this.productName) this.getProductsByName();
    });

    this.productBarcodeInput.addEventListener("input", (event) => {
      this.productbarcode = event.target.value;
    });

    this.productSearchByBarcodeBtn.addEventListener("click", () => {
      if (this.productbarcode) this.getProductByBarcode();
    });

    this.productsGrid.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card[data-barcode]");

      if (productCard) {
        this.openProductLogModal();
        this.productDetails = this.productsList.find(
          (item) => item.barcode === productCard.dataset.barcode,
        );
        this.renderProductLogModal(this.productDetails);
      }
    });

    this.productLogModal.addEventListener("click", (event) => {
      if (event.target === this.productLogModal) this.closeProductLogModal();
    });

    this.closeProductModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeProductLogModal();
      });
    });

    this.addProductToLogBtn.addEventListener("click", () => {
      const obj = this.prepareLogProductObj();
      this.NL.handleLogMealObj(obj);
      this.closeProductLogModal();
    });

    this.nutriScoreFilter.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        this.nutriScoreValue = event.target.dataset.grade;
        this.filterByNutriScore();
      });
    });

    document
      .getElementById("product-categories")
      .addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-category]");
        if (btn) {
          this.productCategory = btn.dataset.category;
          this.getProductsByCategory();
        }
      });
  }
}
