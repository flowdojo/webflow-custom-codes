// hide the navbar logo initially

console.log("Hello Onething");

const navbarLogo = document.querySelector(".navbar4_logo-link.w-nav-brand");
const mobileNavbarLogo = document.querySelector(".nav-icon-mobile");

const loaderLogoPaths = [];

for (let index = 0; index <= 14; index++) {
  const path = document.querySelector(
    `.loader-logo-embed [id='svg-path-${index}']`
  );
  loaderLogoPaths.push(path);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 767) {
    navbarLogo.style.visibility = "hidden";

    loaderLogoPaths.forEach((logo, i) => {
      logo.style.willChange = "transform";
      logo.style.transitionDelay = `${i / 50}s`;
      logo.classList.add("show-path");
    });

    setTimeout(() => {
      document.querySelector(".loader-logo-wrap").classList.add("move-up");
      // document.querySelector(".loader-background").classList.add("move-bg-up");
    }, 1000);
    setTimeout(() => {
      document.querySelector(".loader-background").classList.add("move-bg-up");
      // this has been stored in the global variable and is accessible everywhere
      initiateSplitAnimation();
    }, 1050);
    setTimeout(() => {
      document.querySelector(".loader-container").classList.remove("show");

      navbarLogo.style.visibility = "visible";
      ctaPopupHandler();
    }, 1700);
  } else {
    mobileNavbarLogo.style.visibility = "hidden";

    document.querySelector(".loader-mobile-logo-embed").classList.add("show");
    // for mobile
    setTimeout(() => {
      document.querySelector(".loader-logo-wrap").classList.add("move-up");
      // document.querySelector(".loader-background").classList.add("move-bg-up");
    }, 1000);
    setTimeout(() => {
      document.querySelector(".loader-background").classList.add("move-bg-up");
      initiateSplitAnimation();
    }, 1050);
    setTimeout(() => {
      document.querySelector(".loader-container").classList.remove("show");
      mobileNavbarLogo.style.visibility = "visible";
      ctaPopupHandler();
    }, 1700);
  }
});

function ctaPopupHandler() {
  if (window.location.href.includes("onething.design")) {
    console.log("running on production");
    return;
  }

  // console.log("Running On Staging");
  // let timeoutId;
  // let previousUrl = location.href;

  // const openPopupButtons = document.querySelectorAll(
  //   "[fd-code='open-cta-popup']"
  // );

  // const closePopuButton = document.querySelector("[fd-code='close-cta-popup']");
  // openPopupButtons.forEach((button) => {
  //   button.addEventListener("click", (e) => {
  //     e.preventDefault();

  //     clearTimeout(timeoutId);

  //     timeoutId = setTimeout(() => {
  //       console.log("Popup Opened");
  //       window.history.pushState(null, null, "/contact");
  //       hasExecuted = true;
  //     }, 100);
  //   });
  // });

  // closePopuButton.addEventListener("click", (e) => {
  //   e.preventDefault();

  //   clearTimeout(timeoutId);
  //   timeoutId = setTimeout(() => {
  //     console.log("Popup closed");

  //     history.replaceState(null, null, previousUrl);

  //     // Now go back in history
  //     history.back();
  //   }, 100);
  // });
}
