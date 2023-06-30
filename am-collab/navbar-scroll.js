const init = () => {
  const navbar = document.querySelector(".nav_component.w-nav");
  let scrollUpValue = 0;

  // add event listener to document
  let lastScrollTop = window.pageYOffset;
  // the amount of pixels to scroll up to show the navbar again
  const THRESHOLD = 20;
  document.addEventListener("scroll", () => {
    const currentTopValue = window.pageYOffset;
    const windowWidth = window.innerWidth;

    if (windowWidth > 992) {
      if (currentTopValue > lastScrollTop) {
        // scrolled down
        navbar.style.visibility = "hidden";
        scrollUpValue = 0;
      } else {
        // scrolling up
        scrollUpValue++;

        if (scrollUpValue >= THRESHOLD || currentTopValue <= 5) {
          navbar.style.visibility = "visible";
        }
      }
    } else {
      navbar.style.visibility = "visible";
    }
    lastScrollTop = currentTopValue;
  });

  window.addEventListener("resize", () => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 992) {
      navbar.style.visibility = "visible";
    }
  });
};

init();
