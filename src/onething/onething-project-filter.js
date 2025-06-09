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
    updateSlug(btnText); // Add slug to URL when button clicked
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

// Filters the projects
function filterProjects(filterName) {
  console.log("[filterProjects] Filtering projects with:", filterName);
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  Webflow.require("ix2").init();
}

// Renders filtered projects
function renderProjects(projects) {
  console.log("[renderProjects] Number of projects to render:", projects.length);
  const projectsWrapper = document.querySelector("[fd-code='projects-wrapper']");
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

// Auto-apply filter based on ?filter param and keep slug in URL
document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const rawParam = url.searchParams.get("filter") || "all";
  console.log("[DOMContentLoaded] URL filter param:", rawParam);
  
  const filterParam = sanitizeText(rawParam);
  const textFromSlug = filterParam.replace(/-/g, " ");

  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    return btnText === textFromSlug;
  });

  if (matchingBtn || filterParam === "all") {
    console.log("[DOMContentLoaded] Found matching button or 'all', applying filter:", textFromSlug);
    applyFilter(textFromSlug);

    // If not "all", add filter param to URL to keep slug visible
    if (textFromSlug !== "all") {
      console.log("[DOMContentLoaded] Updating URL slug to keep filter param");
      updateSlug(textFromSlug);
    }

  } else {
    // Invalid filter — remove from URL and apply "all"
    console.log("[DOMContentLoaded] Invalid filter param, removing filter from URL");
    url.searchParams.delete("filter");
    history.replaceState(null, "", url.toString());
    applyFilter("all");
  }

  // Prevent auto scroll on load
  window.scrollTo({ top: 0, behavior: "auto" });
});
