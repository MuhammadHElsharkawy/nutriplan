const PAGE_HEADERS = {
  home: {
    title: "Meals & Recipes",
    subtitle: "Discover delicious and nutritious recipes tailored for you",
  },
  products: {
    title: "Product Scanner",
    subtitle: "Search packaged foods by name or barcode",
  },
  foodlog: {
    title: "Food Log",
    subtitle: "Track your daily nutrition and food intake",
  },
  meal: {
    title: "Recipe Details",
    subtitle: "View full recipe information and nutrition facts",
  },
};

const initHeader = () => {
  document.addEventListener("page-changed", (event) => {
    const { pageId } = event.detail;
    const header = PAGE_HEADERS[pageId];
    if (!header) return;

    document.getElementById("page-title").textContent = header.title;
    document.getElementById("page-subtitle").textContent = header.subtitle;
  });
};

export { initHeader };
