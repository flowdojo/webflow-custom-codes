setUpMutationObserver();

setupMutationObserverForNavbar();

toggleNavbarColorBasedOnBackground();
observerNavOpenAndClose();

let currentBgColor = window.getComputedStyle(document.body).backgroundColor;

if (currentBgColor === "rgba(0, 0, 0, 0)") {
  adjustNavbarForLightBackground();
}

function setUpMutationObserver() {
  // Select the node that will be observed for mutations
  //const joinPackButton = document.getElementById("oneion-join-pack");
  const targetNode = document.body;

  // Options for the observer (which mutations to observe)
  const config = { attributes: true };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        toggleNavbarColorBasedOnBackground();
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function setupMutationObserverForNavbar() {
  // Select the node that will be observed for mutations
  const targetNode = document.querySelector(".nav-menu-2");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        toggleMobileLogoEmbedColor();
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function adjustNavbarForLightBackground() {
  // Navbar links
  const navbarLinks = document.querySelectorAll(".navbar-link");

  navbarLinks.forEach((link) => {
    link.style.color = "#121212";
  });

  // Light and Dark buttons
  const lightBtn = document.getElementById("light-btn");
  const darkBtn = document.getElementById("dark-btn");
  if (lightBtn) lightBtn.style.display = "none";
  if (darkBtn) darkBtn.style.display = "flex";

  // Menu icon lines
  const menuIconLines = document.querySelectorAll(
    ".menu-icon4_line-top, .menu-icon_line-middle-base,.menu-icon4_line-bottom"
  );
  menuIconLines.forEach((line) => {
    line.style.backgroundColor = "#121212";
  });

  // Logo
  const logos = document.querySelectorAll(".logo");
  logos.forEach((logo) => {
    logo.style.filter = "invert(0)";
  });
  document.querySelector(".navbar4_logo-link").style.color = "#121212";
  const desktopLogo = document.querySelector("img.nav-icon-desktop");
  if (desktopLogo) {
    desktopLogo.style.filter = "invert(0)";
  }
}

intersectionObserverForSpecificSections();

function intersectionObserverForSpecificSections() {
  const navHeight = 80;

  const sections = document.querySelectorAll(
    "[fd-enable-nav-observe] [fd-nav='make-dark']"
  );

  document.addEventListener("scroll", () => {
    sections.forEach((section) => {
      const bodyRect = document.body.getBoundingClientRect();
      const elemRect = section.getBoundingClientRect();
      const distance = elemRect.top - bodyRect.top;
      const scroll = window.scrollY;
      if (
        scroll >= distance &&
        scroll <= distance + section.offsetHeight - navHeight
      ) {
        // the element is in view
        adjustNavbarForLightBackground();
      } else {
        adjustNavbarForDarkBackground();
      }
    });
  });

  // const options = {
  //   rootMargin: "80px",
  //   threshold: 0.7,
  // };

  // const callback = (entries, observer) => {
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       console.log("Intersectingg ", entry.intersectionRatio);
  //       if (entry.intersectionRatio >= 0.7) {
  //         adjustNavbarForLightBackground();
  //       }
  //     } else {
  //       toggleNavbarColorBasedOnBackground();
  //     }
  //   });
  // };

  // sections.forEach((section) => {
  //   const observer = new IntersectionObserver(callback, options);
  //   observer.observe(section);
  // });
}

function adjustNavbarForDarkBackground() {
  // Navbar links
  const navbarLinks = document.querySelectorAll(".navbar-link");
  navbarLinks.forEach((link) => {
    link.style.color = "white";
  });

  // Light and Dark buttons
  const lightBtn = document.getElementById("light-btn");
  const darkBtn = document.getElementById("dark-btn");
  if (lightBtn) lightBtn.style.display = "flex";
  if (darkBtn) darkBtn.style.display = "none";

  // Menu icon lines
  const menuIconLines = document.querySelectorAll(
    ".menu-icon4_line-top, .menu-icon_line-middle-base,.menu-icon4_line-bottom"
  );
  menuIconLines.forEach((line) => {
    line.style.backgroundColor = "white";
  });

  // Logo
  const logos = document.querySelectorAll(".logo");
  logos.forEach((logo) => {
    logo.style.filter = "invert(1)";
  });

  // Logo
  const logo = document.querySelector(".logo-embed");
  if (logo) {
    logo.style.color = "white";
  }

  const desktopLogo = document.querySelector("img.nav-icon-desktop");
  if (desktopLogo) {
    desktopLogo.style.filter = "invert(1)";
  }
  document.querySelector(".navbar4_logo-link").style.color = "white";
}

function toggleNavbarColorBasedOnBackground() {
  let currentBgColor = window.getComputedStyle(document.body).backgroundColor;
  if (
    currentBgColor === "rgb(255, 255, 255)" ||
    currentBgColor === "rgba(255, 255, 255, 1)"
  ) {
    console.log("adjusting for light bg");
    adjustNavbarForLightBackground();
  } else {
    adjustNavbarForDarkBackground();
  }
}

function toggleMobileLogoEmbedColor() {
  let currentBgColor = window.getComputedStyle(document.body).backgroundColor;
  if (
    currentBgColor === "rgb(255, 255, 255)" ||
    currentBgColor === "rgba(255, 255, 255, 1)"
  ) {
    // Logo
    const logo = document.querySelector(".logo-embed");
    if (logo) {
      logo.style.color = "#121212";
    }
  } else {
    // Logo
    const logo = document.querySelector(".logo-embed");
    if (logo) {
      logo.style.color = "white";
    }
  }
}

function observerNavOpenAndClose() {
  const targetNode = document.querySelector(".menu-icon4_line-middle");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true };
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        const isNavClosed =
          getComputedStyle(targetNode).transform === "matrix(1, 0, 0, 1, 0, 0)";
        if (isNavClosed) {
          const currentBgColor = getComputedStyle(
            document.body
          ).backgroundColor;

          if (currentBgColor !== "rgb(255, 255, 255)") {
            // color is not white, it is black or red
            targetNode.querySelector(
              ".menu-icon_line-middle-base"
            ).style.backgroundColor = "white";
            document.querySelector("a.navbar4_logo-link").style.color = "white";
          } else {
            // change navbar logo color to white as bg is not white
            document.querySelector("a.navbar4_logo-link").style.color =
              "#121212";
          }
        } else {
          const currentBgColor = getComputedStyle(
            document.body
          ).backgroundColor;
          if (currentBgColor !== "rgb(255, 255, 255)") {
            targetNode.querySelector(
              ".menu-icon_line-middle-base"
            ).style.backgroundColor = "white";
          }
          // navbar logo will always be white when the navbar is opened
          document.querySelector("a.navbar4_logo-link").style.color = "white";
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}