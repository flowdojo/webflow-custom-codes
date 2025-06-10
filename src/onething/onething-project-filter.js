const allProjects = [
  ...document.querySelectorAll(".project-grid .project-card"),
];

const ctaSection = document.querySelector(".projects-wrap .cta-section-2");
const filterButtons = document.querySelectorAll("[fd-filter-btn]");
const noItemsFound = document.querySelector("[fd-code='no-items-found']");

let filterTimeoutId;

// Attach click events to filter buttons
filterButtons.forEach((btn) => {
  const btnText = getInnerText(btn.querySelector("div"));

  btn.addEventListener("click", () => {
    console.log("[Click] Button clicked:", btnText);
    updateSlug(btnText);
    applyFilter(btnText);
  });
});

// Adds or removes query param in URL
function updateSlug(filterName) {
  const slug = sanitizeText(filterName).replace(/\s+/g, "-");
  const url = new URL(window.location.href);

  if (slug === "all") {
    url.searchParams.delete("filter");
    console.log("[updateSlug] Removing filter param from URL");
  } else {
    url.searchParams.set("filter", slug);
    console.log("[updateSlug] Setting filter param in URL:", slug);
  }

  history.pushState(null, "", url.toString());
  console.log("[updateSlug] URL after update:", window.location.href);
}

// Applies the filtering and active button state
function applyFilter(filterName) {
  console.log("[applyFilter] Applying filter:", filterName);
  filterButtons.forEach((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    btn.classList.toggle("is-active", btnText === filterName);
  });

  clearTimeout(filterTimeoutId);
  filterTimeoutId = setTimeout(() => {
    filterProjects(filterName);
  });
}

// Filters the projects with normal behavior
function filterProjects(filterName) {
  console.log("[filterProjects] Filtering projects with:", filterName);
  
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  
  // Just initialize Webflow animations without affecting scroll
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (window.Webflow && window.Webflow.require) {
        Webflow.require("ix2").init();
      }
    }, 10);
  });
}

// Renders filtered projects
function renderProjects(projects) {
  console.log("[renderProjects] Number of projects to render:", projects.length);
  const projectsWrapper = document.querySelector("[fd-code='projects-wrapper']");
  
  // Clear content without affecting scroll
  projectsWrapper.innerHTML = "";

  if (!projects.length) {
    removeHideClass(noItemsFound);
    return;
  }

  addHideClass(noItemsFound);

  if (projects.length <= 2) {
    createGridAndAddProjects(projects);
    return;
  }

  const OFFSET = projects.length <= 4 ? 2 : 4;
  const projectsToShowBeforeCTA = projects.slice(0, OFFSET);
  const projectsToShowAfterCTA = projects.slice(OFFSET);

  createGridAndAddProjects(projectsToShowBeforeCTA);
  createGridAndAddProjects(projectsToShowAfterCTA);

  function createGridAndAddProjects(projects) {
    let gridDiv = document.createElement("div");
    gridDiv.classList.add("project-grid");

    projects.forEach((proj) => {
      gridDiv.append(proj.cloneNode(true));
    });
    projectsWrapper.append(gridDiv);
  }
}

// Filter matching logic
function getFilteredProject(filterName) {
  if (filterName === "all") return allProjects;

  const normalizedFilter = sanitizeText(filterName).replace(/-/g, " ");

  return allProjects.filter((project) => {
    const projectCategories = [
      ...project.querySelectorAll("[fd-code='project-category']"),
    ].map(getInnerText);

    return projectCategories.some(
      (category) => category === normalizedFilter
    );
  });
}

// Utility functions
function addHideClass(el) {
  el.classList.add("hide");
}

function removeHideClass(el) {
  el.classList.remove("hide");
}

function getInnerText(node) {
  return sanitizeText(node?.innerText || "");
}

function sanitizeText(text) {
  return text.toLowerCase().trim();
}

/* 
  === RUN FILTER PARAM CHECK AND URL UPDATE EARLY === 
  This runs immediately as script loads, before DOMContentLoaded 
*/
(function earlyFilterParamCheck() {
  const url = new URL(window.location.href);
  const rawParam = url.searchParams.get("filter");
  
  // If no filter param exists, do nothing
  if (!rawParam) {
    console.log("[earlyFilterParamCheck] No filter param found in URL");
    return;
  }

  console.log("[earlyFilterParamCheck] URL filter param:", rawParam);

  const filterParam = sanitizeText(rawParam);
  
  // Only remove if filter param is explicitly "all"
  if (filterParam === "all") {
    console.log("[earlyFilterParamCheck] Filter is 'all', removing from URL");
    url.searchParams.delete("filter");
    history.replaceState(null, "", url.toString());
  } else {
    // Keep the filter param as is for now, validation will happen in DOMContentLoaded
    console.log("[earlyFilterParamCheck] Keeping filter param for validation:", filterParam);
  }
})();

// Apply filter on DOM ready with enhanced scroll control
document.addEventListener("DOMContentLoaded", () => {
  const element = document.querySelector('.collection-list-wrapper-4'); // ya ID ho to '#your-id'
  
  // Check if element exists before applying styles
  if (element) {
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.gap = '80px';
  } else {
    console.warn("[DOMContentLoaded] Element with class '.projects-wrapper' not found");
  }

  // Force scroll to top immediately
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  
  const url = new URL(window.location.href);
  const rawParam = url.searchParams.get("filter") || "all";
  console.log("[DOMContentLoaded] Applying filter on DOMContentLoaded:", rawParam);

  const filterParam = sanitizeText(rawParam);
  const textFromSlug = filterParam.replace(/-/g, " ");

  // Validate filter parameter against available buttons
  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    return btnText === textFromSlug;
  });

  // If filter param is invalid (no matching button found), remove it
  if (!matchingBtn && textFromSlug !== "all") {
    console.log("[DOMContentLoaded] Invalid filter param, removing from URL:", textFromSlug);
    url.searchParams.delete("filter");
    history.replaceState(null, "", url.toString());
    // Apply "all" filter as fallback
    applyFilter("all");
  } else {
    // Apply the valid filter
    applyFilter(textFromSlug);
  }

  // Multiple scroll preventions to ensure page stays at top
  const preventScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  // Immediate prevention
  preventScroll();
  
  // Prevent scroll during and after filter application
  setTimeout(preventScroll, 50);
  setTimeout(preventScroll, 100);
  setTimeout(preventScroll, 200);

  // After short delay, check active filter and sync URL if needed
  setTimeout(() => {
    const activeBtn = Array.from(filterButtons).find((btn) =>
      btn.classList.contains("is-active")
    );
    if (!activeBtn) return;

    const activeText = getInnerText(activeBtn.querySelector("div"));
    const activeSlug = activeText.replace(/\s+/g, "-");

    const currentUrl = new URL(window.location.href);
    const urlFilter = currentUrl.searchParams.get("filter");

    // If active filter is NOT 'all' and URL doesn't have matching filter param, add it
    if (activeText !== "all" && urlFilter !== activeSlug) {
      console.log("[DelayedURLSync] URL missing slug for active filter. Updating URL to:", activeSlug);
      currentUrl.searchParams.set("filter", activeSlug);
      history.replaceState(null, "", currentUrl.toString());
    } else {
      console.log("[DelayedURLSync] URL filter param already correct or active is 'all'");
    }
    
    // Final scroll prevention
    preventScroll();
  }, 300);

  // Add scroll event listener to prevent unwanted scrolling during initial load
  let initialLoadComplete = false;
  const scrollHandler = (e) => {
    if (!initialLoadComplete) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: false });
  
  // Remove scroll handler after initial load is complete
  setTimeout(() => {
    initialLoadComplete = true;
    window.removeEventListener('scroll', scrollHandler);
  }, 1000);
});
