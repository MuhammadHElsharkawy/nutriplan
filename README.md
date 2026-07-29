# 🥗 NutriPlan

NutriPlan is a single-page web app for discovering recipes, checking packaged product nutrition facts, and tracking your daily food intake — built with vanilla JavaScript (no frameworks) as a hands-on project to learn core web development concepts from the ground up: client-side routing, event-driven architecture, async data fetching, and browser storage.

## ✨ Features

- **Recipe Discovery** — browse random recipes, filter by cuisine (area) or category, or search by name
- **Recipe Details** — full recipe view with ingredients, instructions, embedded YouTube video (when available), and a nutrition breakdown
- **Product Lookup** — search packaged products or browse by category, with Nutri-Score-based visual grading
- **Daily Food Log** — log meals or products to a running daily total, track progress against calorie/macro goals, and view a 7-day overview with weekly stats
- **Client-side routing** — clean, bookmarkable URLs (e.g. `/details/some-recipe/52772`) powered by the History API, with full back/forward button support

## 🛠️ Tech Stack

- **Vanilla JavaScript** (ES Modules) — no frontend framework
- **Tailwind CSS** — utility-first styling
- **SweetAlert2** — toast notifications and modals
- **Font Awesome** — icons
- **[NutriPlan API](https://nutriplan-api.vercel.app)** — recipes, product data, and nutrition analysis

## 📁 Project Structure

```
├── index.html              # Single HTML shell — all "pages" live here as toggled sections
├── js/
│   ├── main.js              # Entry point — initializes every module
│   ├── Router.js            # Client-side routing (History API)
│   ├── Sidebar.js           # Sidebar open/close behavior
│   ├── shared.js            # Shared app state (loading flags, filters, goals)
│   ├── EndPoints.js         # API endpoint definitions
│   ├── meal-service.js      # Meals API calls
│   ├── meal-service-instance.js
│   ├── products-service.js  # Products API calls
│   ├── product-service-instance.js
│   ├── area.js               # Cuisine filter UI
│   ├── category.js           # Category filter UI
│   ├── search.js              # Debounced recipe search
│   ├── meal.js                 # Recipe grid rendering
│   ├── meal-details.js         # Single recipe page
│   ├── product.js              # Products page
│   ├── food-log.js             # Daily food log page
│   ├── nutriplan-log.js        # Food log storage logic (localStorage)
│   ├── sweetalert.js           # Toast/alert wrapper
│   └── utils.js                # Small shared helpers (e.g. slugify)
└── vercel.json              # SPA rewrite rule for client-side routing
```

## 🚀 Getting Started

This project has no build step — it runs directly in the browser.

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. Serve it with any local static server (ES modules require `http://`, not `file://`):
   ```bash
   npx serve .
   ```
   or use the VS Code "Live Server" extension.
3. Open the printed local URL in your browser.

## ☁️ Deployment (Vercel)

Since this app uses real (non-hash) URLs via the History API, the server needs to serve `index.html` for *any* path so client-side routing can take over. This project includes a `vercel.json` with the necessary rewrite rule — no extra configuration needed on Vercel's end beyond a standard static deployment.

## 🎯 Why This Project

This app was built as a learning project to practice, from first principles and without relying on a framework:

- Client-side routing with the History API (`pushState`, `popstate`)
- Event-driven communication between independent modules (custom events instead of tight coupling)
- Async/await, error handling, and API integration
- Browser storage (`localStorage`) for persisting user data across sessions
- Debouncing, event delegation, and other everyday DOM patterns

## 📌 Known Limitations

- Nutrition analysis relies on a third-party API key that is currently included client-side; a production version of this app would proxy that request through a small backend to keep the key private.
- No user accounts — food log data is stored locally per-browser and is not synced across devices.
