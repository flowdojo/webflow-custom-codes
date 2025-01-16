// // console.log({ barba });

// barba.init({
//   transitions: [
//     {
//       name: "default-transition",
//       leave(data) {
//         document.body.classList.add("disable-scroll");
//       },
//       async enter({ current, next }) {
//         var done = this.async();
//         // pick the element theme value from the container and assign it to the body
//         await animatePageTransition(current, done, next);

//         // next.container.querySelectorAll("script").forEach((script) => {
//         //   const newScript = document.createElement("script");
//         //   newScript.src = script.src;
//         //   document.body.appendChild(newScript);
//         // });

//         // animatePageHeroHeader(next);
//       },
//     },
//   ],
// });

// function animatePageHeroHeader(currentPageData) {
//   // Call A function to animate heading here
// }

// async function animatePageTransition(
//   currentPageData,
//   doneCallback,
//   nextPageData
// ) {
//   return new Promise((resolve) => {
//     const transitionLoader =
//       currentPageData.container.querySelector(".page-transition");
//     document.body.classList.add("disable-scroll");
//     transitionLoader.classList.add("hide");

//     const transitionLoaderOfNextPage =
//       nextPageData.container.querySelector(".page-transition");
//     transitionLoaderOfNextPage.classList.remove("hide");

//     gsap.set(transitionLoaderOfNextPage, {
//       top: "100%",
//       left: 0,
//       zIndex: 150,
//     });

//     const tl = gsap.timeline({
//       onComplete: () => {
//         document.body.classList.remove("disable-scroll");
//       },
//     });

//     tl.to(transitionLoaderOfNextPage, {
//       top: 0,
//       duration: 0.4,
//       ease: "power2.out",
//       onComplete: () => {
//         doneCallback();
//       },
//     });

//     tl.to(transitionLoaderOfNextPage, {
//       top: "-100%",
//       duration: 0.4,
//       ease: "power2.out",
//       delay: 0.5,
//     });
//   });
// }
