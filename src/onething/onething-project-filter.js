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
    updateSlug(btnText); // ✅ Updates the URL when user clicks
    applyFilter(btnText, true);
  });
});

// Adds or removes query param in URL
function updateSlug(filterName) {
  const slug = sanitizeText(filterName).replace(/\s+/g, "-");
  const url = new URL(window.location.href);

  if (slug === "all") {
    url.searchParams.delete("filter");
  } else {
    url.searchParams.set("filter", slug);
  }

  history.pushState(null, "", url.toString()); // ✅ Updates browser URL without reloading
}

// Applies the filtering and sets active button state
function applyFilter(filterName, updateUrl = false) {
  filterButtons.forEach((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    btn.classList.toggle("is-active", btnText === filterName);
  });

  // ✅ Don't update URL if called on page load
  if (updateUrl) {
    updateSlug(filterName);
  }

  clearTimeout(filterTimeoutId);
  filterTimeoutId = setTimeout(() => {
    filterProjects(filterName);
  });
}

// Filters the projects based on category
function filterProjects(filterName) {
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  Webflow.require("ix2").init();
}

// Renders filtered projects with/without CTA section
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

// Filtering logic based on slug or plain text
function getFilteredProject(filterName) {
  if (filterName === "all") return allProjects;

  return allProjects.filter((project) => {
    const projectCategories = [
      ...project.querySelectorAll("[fd-code='project-category']"),
    ].map(getInnerText);

    const normalizedFilter = sanitizeText(filterName);
    const slugFilter = normalizedFilter.replace(/\s+/g, "-");

    return projectCategories.some((category) => {
      const categorySlug = category.replace(/\s+/g, "-");
      return category === normalizedFilter || categorySlug === slugFilter;
    });
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

function slugToText(slug) {
  return slug.replace(/-/g, " ");
}

// ✅ On page load: apply filter from URL but DO NOT update the URL or scroll
document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const filterParam = url.searchParams.get("filter");

  if (!filterParam) {
    applyFilter("all", false); // Do not update URL
    return;
  }

  const normalizedParam = sanitizeText(filterParam);
  const textFromSlug = slugToText(normalizedParam);

  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    return btnText === normalizedParam || btnText === textFromSlug;
  });

  if (matchingBtn) {
    const btnText = getInnerText(matchingBtn.querySelector("div"));
    applyFilter(btnText, false); // ✅ Apply filter, but keep slug intact
  } else if (normalizedParam === "all") {
    applyFilter("all", false);
  } else {
    applyFilter(textFromSlug, false);
  }

  // ✅ Prevent scroll on page load (especially if URL has anchor/params)
  // Optional: Scroll to top
  window.scrollTo({ top: 0, behavior: "auto" });
});
