gsap.registerPlugin(ScrollTrigger);

// gsap.from(".diamond-boxes", {
//   scale: 0.5,
//   x: "500px",
//   y: "-500px",
//   scrollTrigger: {
//     trigger: ".section-wrapper",
//     start: "top top",
//     scrub: true,
//     pin: true
//   }
// });

// const getXValue = () => {
//   const x =
//     document.querySelector(".scroll-grid").offsetWidth - window.innerWidth;

//   if (x < 0) {
//     return -x;
//   }
//   // adding window.innerWidth / 2 to make the last card come till center of screen
//   return x + window.innerWidth / 2;
// };

const xValue = () => {
  const width = window.innerWidth - 400;
  const visibleWidth = 3600 - width;
  return visibleWidth;
};

const getXPercentage = () => {
  if (window.innerWidth < 1220) {
    return 30;
  }
  if (window.innerWidth <= 1280) {
    return 35;
  }
  if (window.innerWidth <= 1350) {
    return 40;
  } else if (window.innerWidth <= 1465) {
    return 45;
  } else if (window.innerWidth <= 1590) {
    return 55;
  } else if (window.innerWidth <= 1710) {
    return 65;
  } else if (window.innerWidth <= 1880) {
    return 75;
  } else if (window.innerWidth <= 2200) {
    return 90;
  } else {
    return 50;
  }
};

const getXValue = () => {
  console.log(window.innerWidth / 2 - 400);

  if (window.innerWidth / 2 - 400 > 700) {
    return window.innerWidth / 2 - 400;
  } else {
    return 0;
  }
};
const setupAnimation = () => {
  const tl = gsap.timeline();
  tl.set(".diamond-boxes", {
    transformOrigin: `${getXPercentage()}% -8%`
    // transformOrigin: `50% -8%`
  });
  tl.from(".diamond-boxes", {
    scale: 0.4,
    // transformOrigin: "60% -15%",
    transformOrigin: `${getXPercentage()}% -8%`,
    // transformOrigin: `50% 8%`,
    x: `${getXValue()}px`,
    duration: 10,
    top: 150
    // left: "600px"
    // yPercent: -30
  })
    .to(".diamond-boxes", {
      display: "none"
    })
    .to(
      ".scroll-grid",
      {
        display: "flex"
      }
      // 0.4
    )
    .to(".scroll-wrapper", {
      x: `-${xValue()}`,
      duration: 10,
      // xPercent: -100,
      ease: "none"
    });

  ScrollTrigger.create({
    animation: tl,
    trigger: ".section-wrapper",
    start: "top top",
    scrub: true,
    pin: true
  });
};

setupAnimation();
// Update ScrollTrigger positions on window resize
window.addEventListener("resize", function () {
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });

  gsap.set(".diamond-boxes, .scroll-wrapper", { clearProps: "all" });
  setupAnimation();
  ScrollTrigger.refresh();
});
