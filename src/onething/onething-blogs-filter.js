const popup = getElement("search-popup");
const searchResultWrap = getElement("search-result-wrap");
const allAvailableBlogs = [...getElements("search-blog-card")];
const noResultsFoundWrap = popup.querySelector(".no-results-wrap");
const searchResultsFoundNode = popup.querySelector(".results-found");
const searchedResultsListNode = popup.querySelector(".searched-list");
const trendingResults = popup.querySelector(".trending-result");
const searchInputNode = getElement("search-input");

let searchText;

/**
 * Main funciton Calls
 */

addBlogSearchInput();

addBlogFormSubmitListener();
hide(searchResultWrap);
hide(noResultsFoundWrap);

function addBlogSearchInput() {
  searchInputNode.addEventListener("input", (e) => {
    searchText = e.target.value.toLowerCase().trim();

    if (!searchText) {
      hide(searchResultWrap);
      hide(searchedResultsListNode);
      trendingResults.style.display = "block";

      hide(noResultsFoundWrap);
      return;
    } else {
      renderSearchResults();
    }
  });

  searchInputNode.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleSubmit();
      // Add your code here to handle the Enter key press
    }
  });
}

function renderSearchResults() {
  const filteredBlogs = getFilteredBlogs(searchText);

  const headings = filteredBlogs.map(
    (el) => el.querySelector("[fd-code='blog-heading']").innerText
  );

  if (!headings.length) {
    // no results found
    hide(searchResultWrap);
  } else {
    searchResultWrap.style.display = "block";
    const searchResultLists = getElement("search-result-list");
    searchResultLists.innerHTML = "";

    headings.forEach((heading) => {
      const highlightedResult = highlightSearchTerm(heading, searchText);

      console.log({ highlightedResult });
      searchResultLists.innerHTML += `<div class="search-result-box">
      <div>${highlightedResult}</div>
    </div>`;
    });

    searchResultLists
      .querySelectorAll(".search-result-box")
      .forEach((result) => {
        result.addEventListener("click", () => {
          searchText = result.querySelector("div").innerText;
          searchInputNode.value = result.querySelector("div").innerText;
          handleSubmit();
        });
      });
  }
}

function handleSubmit() {
  const searchedBlogCardsWrapper = getElement("searched-blog-cards");
  hide(searchResultWrap);

  const filteredBlogs = getFilteredBlogs(searchText);
  hide(noResultsFoundWrap);
  if (!filteredBlogs.length) {
    // if no results, show trending blogs
    noResultsFoundWrap.innerHTML = `'${searchText}'- No Search Results Found`;
    noResultsFoundWrap.style.display = "block";
    trendingResults.style.display = "block";
  } else {
    // hide trending results
    hide(trendingResults);
    show(searchedResultsListNode);

    searchResultsFoundNode.innerHTML = `'${searchText}'-${formatNumber(
      filteredBlogs.length
    )} Search Results Found`;
    // console.log(filteredBlogs);
    searchedBlogCardsWrapper.innerHTML = "";
    filteredBlogs.forEach((blog) => {
      const html = blog.outerHTML;

      searchedBlogCardsWrapper.innerHTML += html;
    });
  }
}

function highlightSearchTerm(result, query) {
  const regex = new RegExp(`(${query})`, "gi"); // Create a regex to match the query
  return result.replace(
    regex,
    '<span class="highlight-search-query">$1</span>'
  ); // Wrap matches in a span
}

function addBlogFormSubmitListener() {
  const seeAllResultsButton = getElement("see-all-results");

  seeAllResultsButton.addEventListener("click", handleSubmit);

  $("[fd-code='blog-form']").submit(function () {
    return false;
  });
}

function getElements(value) {
  return document.querySelectorAll(`[fd-code="${value}"]`);
}

function getElement(value) {
  return document.querySelector(`[fd-code="${value}"]`);
}

function hide(el) {
  el.style.display = "none";
}

function show(el) {
  el.style.display = "block";
}

function getFilteredBlogs() {
  return allAvailableBlogs.filter((blog) => {
    return getInnerText(
      blog.querySelector("[fd-code='blog-heading']")
    ).includes(searchText.toLowerCase().trim());
  });
}

function formatNumber(num) {
  return num < 10 ? "0" + num : num.toString();
}

function getInnerText(el) {
  return el.innerText.toLowerCase().trim();
}

const setFilterNodeWidth = () => {
  const additionalVal = window.innerWidth > 767 ? 70 : 40;

  const allButtonAddVal = window.innerWidth > 767 ? 40 : 20;
  const filterClearButton = document.querySelector(
    "[fs-cmsfilter-element='clear']"
  );

  filterClearButton.style.width = `${
    filterClearButton.querySelector("span").offsetWidth + allButtonAddVal
  }px`;

  document
    .querySelectorAll("[fs-cmsfilter-field='category']")
    .forEach((span) => {
      const width = span.offsetWidth + additionalVal;

      span.parentNode.parentNode.style.width = `${width}px`;
    });
};

setFilterNodeWidth();

window.addEventListener("resize", setFilterNodeWidth);

/**
 * disable Scrolling on clicking pagination
 */

const paginationWrapper = document.querySelector(".w-pagination-wrapper");
const config = { attributes: false, childList: true, subtree: true };

let paginationTimeoutId;
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      clearTimeout(paginationTimeoutId);
      paginationTimeoutId = setTimeout(disablePaginationScrolling, 100);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(paginationWrapper, config);

function disablePaginationScrolling() {
  const paginationButtons = document.querySelectorAll(
    ".w-pagination-wrapper a"
  );

  console.log({ paginationButtons });

  paginationButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const filtersWrapperNode = document.querySelector(".filters-wrap");
      console.log("clicked");
      setTimeout(() => {
        scrollToTarget(filtersWrapperNode);
      }, 200);
    });
  });

  function scrollToTarget(targetSection) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetElementTop =
      targetSection.getBoundingClientRect().top + scrollTop;

    const offset = 90; // adjust based on nav height

    window.scrollTo({
      top: targetElementTop - offset,
      behavior: "smooth", // Optional for smooth scrolling
    });
  }
}
