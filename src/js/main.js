import { initSidebar } from "./Sidebar.js";
import { initRouter } from "./Router.js";
import { Area } from "./area.js";
import { Category } from "./category.js";
import { Meal } from "./meal.js";
import { S } from "./shared.js";
import { Search } from "./search.js";
import { MealDetails } from "./meal-details.js";
import { Products } from "./product.js";
import { initHeader } from "./header.js";
import { FoodLog } from "./foodlog.js";

initSidebar();
initRouter();

const A = new Area();
const C = new Category();
const M = new Meal();
const MD = new MealDetails();
const P = new Products();
const FL = new FoodLog();

S.startLoading();
try {
  await Promise.all([A.display(), C.display(), M.getMealsArray(true)]);
} finally {
  S.stopLoading();
}

A.getArea();
C.getCategory();

const search = new Search();
M.changeDisplayView();
search.getSearchName();
M.init();
M.initCardClicks();
MD.init();
P.init();
initHeader();
FL.init();
