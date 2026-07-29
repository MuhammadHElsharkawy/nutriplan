const PAGE_IDS = ["home", "products", "foodlog", "meal"];

// Shows the container matching pageId, hides all others
const showPage = (pageId, path, state) => {
  PAGE_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden", id !== pageId);
  });

  document.dispatchEvent(
    new CustomEvent("page-changed", { detail: { pageId, path, state } }),
  );
};

// Reads the current URL path and returns which pageId should be shown
const resolvePageIdFromPath = (path) => {
  // path looks like "/page1" or "/details/coffee-maker-deluxe/5"
  const segments = path.split("/").filter(Boolean); // removes empty strings
  const first = segments[0]; // "page1" or "details"

  if (PAGE_IDS.includes(first)) return first;
  return "home"; // fallback if URL doesn't match anything known
};

// Updates the URL (without reload) and shows the matching page
const navigateTo = (path, state = {}) => {
  document.dispatchEvent(new CustomEvent("before-navigate"));
  history.pushState(state, "", path);
  showPage(resolvePageIdFromPath(path), path, state);
};

const initRouter = () => {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navLinks.forEach((item) => {
      });
      const path = link.getAttribute("href");
      navigateTo(path);
    });
  });

  // 2. Handle back/forward buttons
  window.addEventListener("popstate", (event) => {
    document.dispatchEvent(new CustomEvent("before-navigate"));
    showPage(
      resolvePageIdFromPath(window.location.pathname),
      window.location.pathname,
      event.state,
    );
  });

  // 3. Handle initial page load (direct visit / refresh)
  showPage(
    resolvePageIdFromPath(window.location.pathname),
    window.location.pathname,
    history.state,
  );
};

export { initRouter, navigateTo };
