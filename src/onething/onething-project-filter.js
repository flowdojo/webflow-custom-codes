const allProjects = [...document.querySelectorAll(".project-grid .project-card")];
const ctaSection = document.querySelector(".projects-wrap .cta-section-2");
const filterButtons = document.querySelectorAll("[fd-filter-btn]");
const noItemsFound = document.querySelector("[fd-code='no-items-found']");
let filterTimeoutId;

// Attach click events to filter buttons
filterButtons.forEach((btn) => {
  const btnText = getInnerText(btn.querySelector("div"));
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent any default behavior
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
  
  // Use replaceState instead of pushState to avoid scroll issues
  history.replaceState(null, "", url.toString());
}

// Applies the filtering and active button state
function applyFilter(filterName) {
  // Store current scroll position
  const currentScrollY = window.scrollY;
  
  filterButtons.forEach((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    btn.classList.toggle("is-active", btnText === filterName);
  });
  
  clearTimeout(filterTimeoutId);
  filterTimeoutId = setTimeout(() => {
    filterProjects(filterName);
    
    // Restore scroll position after filtering
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 10);
  }, 50);
}

// Filters the projects
function filterProjects(filterName) {
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  
  // Initialize Webflow animations without scroll
  if (typeof Webflow !== 'undefined' && Webflow.require) {
    try {
      Webflow.require("ix2").init();
    } catch (e) {
      console.log("Webflow ix2 not available");
    }
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

// Filter matching logic
function getFilteredProject(filterName) {
  if (filterName === "all") return allProjects;
  
  return allProjects.filter((project) => {
    const projectCategories = [...project.querySelectorAll("[fd-code='project-category']")].map(getInnerText);
    const filterSlug = sanitizeText(filterName).replace(/\s+/g, "-");
    const originalFilter = sanitizeText(filterName);
    
    return projectCategories.some(category => {
      const categorySlug = category.replace(/\s+/g, "-");
      return category === originalFilter || categorySlug === filterSlug;
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

// Convert slug back to text
function slugToText(slug) {
  return slug.replace(/-/g, " ");
}

// Find matching button for filter
function findMatchingButton(filterParam) {
  const filterText = slugToText(filterParam);
  return Array.from(filterButtons).find((btn) => {
    const btnText = getInnerText(btn.querySelector("div"));
    return btnText === filterParam || btnText === filterText;
  });
}

// Auto-apply filter based on URL param - IMPROVED
document.addEventListener("DOMContentLoaded", () => {
  // Prevent initial scroll animations
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    const filterParam = new URL(window.location.href).searchParams.get("filter");
    
    if (!filterParam) {
      applyFilter("all");
    } else {
      const matchingBtn = findMatchingButton(sanitizeText(filterParam));
      
      if (matchingBtn) {
        const btnText = getInnerText(matchingBtn.querySelector("div"));
        applyFilter(btnText);
        // Update URL to ensure it's there
        updateSlug(btnText);
      } else {
        const filterText = slugToText(sanitizeText(filterParam));
        applyFilter(filterText);
        // Update URL to ensure it's there
        updateSlug(filterText);
      }
    }
    
    // Re-enable scrolling after filter is applied
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 100);
  }, 50);
});

// Handle browser navigation
window.addEventListener('popstate', () => {
  const currentScrollY = window.scrollY;
  const filterParam = new URL(window.location.href).searchParams.get("filter");
  
  if (!filterParam) {
    applyFilter("all");
  } else {
    const matchingBtn = findMatchingButton(sanitizeText(filterParam));
    
    if (matchingBtn) {
      const btnText = getInnerText(matchingBtn.querySelector("div"));
      applyFilter(btnText);
    } else {
      applyFilter(slugToText(sanitizeText(filterParam)));
    }
  }
  
  // Maintain scroll position
  setTimeout(() => {
    window.scrollTo(0, currentScrollY);
  }, 50);
});
