const allProjects = [
  ...document.querySelectorAll(".project-grid .project-card"),
];

const ctaSection = document.querySelector(".projects-wrap .cta-section-2");
const filterButtons = document.querySelectorAll("[fd-filter-btn]");
const noItemsFound = document.querySelector("[fd-code='no-items-found']");

let filterTimeoutId;

filterButtons.forEach((btn) => {
  const btnText = getInnerText(btn.querySelector("div"));

  btn.addEventListener("click", () => {
    updateSlug(btnText);
    applyFilter(btnText);
  });
});

function updateSlug(filterName) {
  const currentPath = window.location.pathname.split("/")[1]; // "projects"
  const basePath = `/${currentPath}`;
  const newSlug = filterName === "all" ? basePath : `${basePath}/${filterName}`;
  history.pushState(null, "", newSlug);
}

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

function filterProjects(filterName) {
  const filteredProjects = getFilteredProject(filterName);
  renderProjects(filteredProjects);
  Webflow.require("ix2").init();
}

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

function getFilteredProject(filterName) {
  if (filterName === "all") return allProjects;

  return allProjects.filter((project) => {
    const projectCategories = [
      ...project.querySelectorAll("[fd-code='project-category']"),
    ].map(getInnerText);

    return projectCategories.includes(sanitizeText(filterName));
  });
}

function addHideClass(el) {
  el.classList.add("hide");
}

function removeHideClass(el) {
  el.classList.remove("hide");
}

function getInnerText(node) {
  return sanitizeText(node.innerText);
}

function sanitizeText(text) {
  return text.toLowerCase().trim();
}

// ✅ AUTO APPLY FILTER FROM URL ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  const urlParts = window.location.pathname.split("/").filter(Boolean);
  const filterFromSlug = urlParts[1] || "all"; // default to 'all' if no filter present
  applyFilter(sanitizeText(filterFromSlug));
});
