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
    updateSlug(btnText); // ✅ Add slug to URL when button clicked
    applyFilter(btnText);
  });
});

// ✅ Adds or removes query param in URL
function updateSlug(filterName) {
  const slug = sanitizeText(filterName).replace(/\s+/g, "-");
  const url = new URL(window.location.href);

  if (slug === "all") {
    url.searchParams.delete("filter");
  } else {
    url.searchParams.set("filter", slug);
  }

  history.pushState(null, "", url.toString());
}

// Applies the filtering and active button state
function applyFilter(filterName) {
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
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  Webflow.require("ix2").init();
}

// Renders filtered projects
function renderProjects(projects) {
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

// ✅ Filter matching logic (supports slug + multi-word)
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

// ✅ Auto-apply filter based on ?filter param (slug supported)
document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const rawParam = url.searchParams.get("filter") || "all";
  const filterParam = sanitizeText(rawParam);
  const textFromSlug = filterParam.replace(/-/g, " ");

  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    return btnText === textFromSlug;
  });

  if (matchingBtn || filterParam === "all") {
    applyFilter(textFromSlug);
  } else {
    url.searchParams.delete("filter");
    history.replaceState(null, "", url.toString());
    applyFilter("all");
  }

  // ✅ Optional: prevent scroll to anchor or jump on load
  window.scrollTo({ top: 0, behavior: "auto" });
});
