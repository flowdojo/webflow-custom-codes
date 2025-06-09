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

// :white_check_mark: Updated: Adds query param to current URL
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
  }, 100); // Added small delay for better performance
}

// Filters the projects
function filterProjects(filterName) {
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  if (typeof Webflow !== 'undefined' && Webflow.require) {
    Webflow.require("ix2").init();
  }
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

// Filter matching logic - FIXED: Now handles both slug format and original text
function getFilteredProject(filterName) {
  if (filterName === "all") return allProjects;
  
  return allProjects.filter((project) => {
    const projectCategories = [
      ...project.querySelectorAll("[fd-code='project-category']"),
    ].map(getInnerText);
    
    // Check both original filter name and slug format
    const filterSlug = sanitizeText(filterName).replace(/\s+/g, "-");
    const originalFilter = sanitizeText(filterName);
    
    return projectCategories.some(category => {
      const categorySlug = category.replace(/\s+/g, "-");
      return category === originalFilter || 
             category === filterSlug || 
             categorySlug === filterSlug ||
             categorySlug === originalFilter;
    });
  });
}

function addHideClass(el) {
  if (el) el.classList.add("hide");
}

function removeHideClass(el) {
  if (el) el.classList.remove("hide");
}

function getInnerText(node) {
  return sanitizeText(node?.innerText || "");
}

function sanitizeText(text) {
  return text.toLowerCase().trim();
}

// Convert slug back to original format for button matching
function slugToText(slug) {
  return slug.replace(/-/g, " ");
}

// :white_check_mark: Auto-apply filter based on ?filter param - FIXED
document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const filterParam = url.searchParams.get("filter");
  
  if (!filterParam) {
    applyFilter("all");
    return;
  }
  
  const normalizedFilterParam = sanitizeText(filterParam);
  const filterTextFromSlug = slugToText(normalizedFilterParam);
  
  // Try to find matching button by both slug and text format
  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    const btnTextSlug = btnText.replace(/\s+/g, "-");
    
    return btnText === normalizedFilterParam || 
           btnText === filterTextFromSlug ||
           btnTextSlug === normalizedFilterParam;
  });
  
  if (matchingBtn) {
    const btnText = getInnerText(matchingBtn.querySelector("div"));
    applyFilter(btnText);
  } else if (normalizedFilterParam === "all") {
    applyFilter("all");
  } else {
    // Invalid filter, but don't remove it immediately
    // Instead, try to apply the filter as-is (it might match project categories)
    applyFilter(filterTextFromSlug);
    
    // Only remove invalid filter if no projects are found
    setTimeout(() => {
      const filteredProjects = getFilteredProject(filterTextFromSlug);
      if (filteredProjects.length === 0) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("filter");
        history.replaceState(null, "", newUrl.toString());
        applyFilter("all");
      }
    }, 100);
  }
});

// FIXED: Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  const url = new URL(window.location.href);
  const filterParam = url.searchParams.get("filter");
  
  if (!filterParam) {
    applyFilter("all");
    return;
  }
  
  const normalizedFilterParam = sanitizeText(filterParam);
  const filterTextFromSlug = slugToText(normalizedFilterParam);
  
  const matchingBtn = Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    const btnTextSlug = btnText.replace(/\s+/g, "-");
    
    return btnText === normalizedFilterParam || 
           btnText === filterTextFromSlug ||
           btnTextSlug === normalizedFilterParam;
  });
  
  if (matchingBtn) {
    const btnText = getInnerText(matchingBtn.querySelector("div"));
    applyFilter(btnText);
  } else {
    applyFilter(filterTextFromSlug);
  }
});
