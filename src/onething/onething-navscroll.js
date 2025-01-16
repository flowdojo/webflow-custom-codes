document.addEventListener("DOMContentLoaded", () => {
  // Variables to track scroll position and direction
  let lastScrollY = 0;
  let isScrollingUp = false;

  // Debounce timeout to detect scroll stop
  let scrollTimeout;
  // Function to hide/show navbar based on scroll direction
  function handleScroll({ scroll }) {
    const navbar = document.querySelector(".nav-bar-wrapper");
    const scrollPosition = window.scrollY;
    // Apply blur effect once scroll reaches 300px
    if (scrollPosition > 0) {
      navbar.style.backdropFilter = "blur(10px)";
      navbar.style.webkitBackdropFilter = "blur(10px)";
    } else {
      navbar.style.backdropFilter = "none";
      navbar.style.webkitBackdropFilter = "blur(0px)";
    }

    const currentScrollY = scroll;

    // Clear any existing timeout to reset the scroll stop detection
    clearTimeout(scrollTimeout);

    // Check if the user is scrolling up
    if (currentScrollY < lastScrollY) {
      isScrollingUp = true;
      document.querySelector(".nav-bar-wrapper").style.transform =
        "translateY(0%)";
    }
    // Check if the user is scrolling down
    else if (currentScrollY > lastScrollY) {
      isScrollingUp = false;
      if (window.scrollY < 500) {
        document.querySelector(".nav-bar-wrapper").style.transform =
          "translateY(0%)";

        return;
      }

      document.querySelector(".nav-bar-wrapper").style.transform =
        "translateY(-100%)";
    }

    // Update lastScrollY to current position
    lastScrollY = currentScrollY;

    // Set a timeout to detect scroll stop
    if (window.innerWidth > 767) {
      scrollTimeout = setTimeout(() => {
        document.querySelector(".nav-bar-wrapper").style.transform =
          "translateY(0%)";
      }, 100); // Adjust the timeout duration as needed
    }
  }

  // Attach the scroll event listener to Lenis
  lenis.on("scroll", handleScroll);

  // Call Lenis's RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});
