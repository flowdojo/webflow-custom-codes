"use strict";

window.Webflow ||= [];
window.Webflow.push(() => {
  // disable form submission
  $("[fd-code='form']").submit(function () {
    return false;
  });

  const filterButtons = document.querySelectorAll("[fd-filter-btn]");
  const filterableItems = document.querySelectorAll("[fd-filter-item]");

  const searchInputNode = document.querySelector("[fd-code='search-filter']");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const clickedBtnText = btn.getAttribute("fd-filter-btn").trim();

      filterButtons.forEach(removeActiveClass);

      addActiveClass(btn);

      if (clickedBtnText === "all") {
        showAll();
        return;
      }

      filterTeamMembers(clickedBtnText);
    });
  });

  filterButtons[0].click();

  /**
   * Search Input Filteration
   */
  addSearchFunctionality();

  function filterTeamMembers(clickedBtnText) {
    filterableItems.forEach((item) => {
      const filterableItemType = item.getAttribute("fd-filter-item").trim();
      if (filterableItemType === clickedBtnText) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  function addSearchFunctionality() {
    let timeoutId;

    searchInputNode.addEventListener("input", (e) => {
      clearTimeout(timeoutId);

      const searchString = e.target.value.toLowerCase().trim();

      if (!searchString) {
        const currentlyActiveFilterText = document
          .querySelector("[fd-filter-btn].category-active")
          .getAttribute("fd-filter-btn")
          .trim();

        if (currentlyActiveFilterText === "all") {
          showAll();
          return;
        }

        filterTeamMembers(currentlyActiveFilterText);
        return;
      }

      timeoutId = setTimeout(() => {
        filterableItems.forEach((item) => {
          const filterableItemType = item
            .getAttribute("fd-filter-item")
            .trim()
            .toLowerCase();

          const isNameMatching = getInnerTextOfMember(
            item,
            "member-name"
          ).includes(searchString);

          const isLocationMatching = checkIfLocationIsMatching(
            item,
            searchString
          );

          const isTypeMatching = filterableItemType.includes(searchString);

          if (isNameMatching || isLocationMatching || isTypeMatching) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      }, 500);
    });
  }

  function getInnerTextOfMember(item, attributeValue) {
    return item
      .querySelector(`[fd-code='${attributeValue}']`)
      .innerText.trim()
      .toLowerCase();
  }

  function checkIfLocationIsMatching(item, searchedText) {
    const allLocations = [
      ...item.querySelectorAll("[fd-code='member-location']"),
    ];

    return allLocations.some((loc) =>
      loc.innerText.toLowerCase().includes(searchedText)
    );
  }

  function removeActiveClass(el) {
    el.classList.remove("category-active");
  }
  function addActiveClass(el) {
    el.classList.add("category-active");
  }

  function showAll() {
    filterableItems.forEach((item) => {
      item.style.display = "block";
    });
  }
});
