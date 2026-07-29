export const initSidebar = () => {
  const sidebarMenuOpenBtn = document.getElementById("sidebar-menu-open");
  const sidebarMenuCloseBtn = document.getElementById("sidebar-menu-close");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  const openSidebarMenu = () => {
    sidebarOverlay?.classList.add("active");
    sidebar?.classList.remove("-translate-x-full");
  };
  const closeSidebarMenu = () => {
    sidebarOverlay?.classList.remove("active");
    sidebar?.classList.add("-translate-x-full");
  };

  sidebarMenuOpenBtn?.addEventListener("click", openSidebarMenu);
  sidebarMenuCloseBtn?.addEventListener("click", closeSidebarMenu);
  sidebarOverlay?.addEventListener("click", closeSidebarMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebarMenu();
  });

  document.addEventListener("page-changed", (event) => {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("text-emerald-700");
      link.classList.add("text-gray-600");
      link.classList.remove("bg-emerald-50");
      link.classList.remove("font-semibold");
      link.classList.add("font-medium");

      if (link.getAttribute("href") === `/${event.detail.pageId}`) {
        link.classList.add("text-emerald-700");
        link.classList.remove("text-gray-600");
        link.classList.add("bg-emerald-50");
        link.classList.add("font-semibold");
        link.classList.remove("font-medium");
        link.classList.remove("hover:bg-gray-50");
      }
    });
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeSidebarMenu();
    })
  })
};
