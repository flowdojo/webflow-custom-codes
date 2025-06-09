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
    updateSlug(btnText);
    applyFilter(btnText);
  });
});

// Adds query param to current URL
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

// Filter matching logic - FIXED for multi-word filters
function getFilteredProject(filterName) {
  if (filterName === "all") return allProjects;

  return allProjects.filter((project) => {
    const projectCategories = [
      ...project.querySelectorAll("[fd-code='project-category']"),
    ].map(getInnerText);

    // Handle both normal text and slug format
    const normalizedFilter = sanitizeText(filterName);
    const slugFilter = normalizedFilter.replace(/\s+/g, "-");
    
    return projectCategories.some(category => {
      const categorySlug = category.replace(/\s+/g, "-");
      return category === normalizedFilter || categorySlug === slugFilter;
    });
  });
}

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

// Convert slug back to text for button matching
function slugToText(slug) {
  return slug.replace(/-/g, " ");
}

// Auto-apply filter based on URL param - FIXED for multi-word
document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const filterParam = url.searchParams.get("filter");

  if (!filterParam) {
    applyFilter("all");
    return;
  }

  const normalizedParam = sanitizeText(filterParam);
  const textFromSlug = slugToText(normalizedParam);

  // Try to find matching button
  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    return btnText === normalizedParam || btnText === textFromSlug;
  });

  if (matchingBtn) {
    const btnText = getInnerText(matchingBtn.querySelector("div"));
    updateSlug(btnText); // Add URL update when applying filter from URL param
    applyFilter(btnText);
  } else if (normalizedParam === "all") {
    applyFilter("all");
  } else {
    // Try applying the filter even if button not found (might match project categories)
    updateSlug(textFromSlug); // Add URL update when applying filter from URL param
    applyFilter(textFromSlug);
  }
});
