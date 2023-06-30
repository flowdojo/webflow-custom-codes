const targetElement = document.querySelector(".animation-abso-grid-2");

const observer = new MutationObserver(function (mutationslist, observer) {
  for (let mutation of mutationslist) {
    if (mutation.type === "attributes") {
      if (mutation.attributeName === "style") {
        const newOpacity = mutation.target.style.opacity;
        if (Number(newOpacity) === 1) {
          targetElement.style.pointerEvents = "all";
        } else {
          targetElement.style.pointerEvents = "none";
        }
      }
    }
  }
});

// Configure the observer to watch for style attribute changes
const observerConfig = {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ["style"]
};

// Start observing the target element
observer.observe(targetElement, observerConfig);
