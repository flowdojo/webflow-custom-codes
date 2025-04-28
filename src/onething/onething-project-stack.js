const stackWrapper =
  window.innerWidth > 767
    ? document.querySelector("[fd-code='work-stack-wrapper']")
    : document.querySelector("[fd-code='work-stack-wrapper-mobile']");

const stackTimeline = gsap.timeline();

const stackCards = [...stackWrapper.querySelectorAll(".project-stack-card")];

let baseScaling = 1 - stackCards.length;

if (window.innerWidth > 767) {
  let basePosition = 110;
  let baseScale = 0.92;
  stackCards.forEach((card, index) => {
    stackTimeline.fromTo(
      card,
      { top: index === 0 ? "48px" : "120%" },
      { top: basePosition },
      `label-${index}`
    );

    if (index > 0) {
      stackTimeline.to(
        stackCards[index - 1],
        {
          scale: baseScale,
        },
        `label-${index}`
      );
    }
    basePosition += 20;
    baseScale += 0.02;
  });
} else {
  let basePosition = 85;
  let baseScale = 0.92;
  stackCards.forEach((card, index) => {
    stackTimeline.fromTo(
      card,
      { top: index === 0 ? "30px" : "120%" },
      { top: basePosition },
      `label-${index}`
    );

    if (index > 0) {
      stackTimeline.to(
        stackCards[index - 1],
        {
          scale: baseScale,
        },
        `label-${index}`
      );
    }
    basePosition += 20;
    baseScale += 0.02;
  });
}

ScrollTrigger.create({
  animation: stackTimeline,
  trigger: stackWrapper,
  scrub: true,
  pin: true,
  start: "top top",
  end: () => (window.innerWidth > 767 ? "+=1200" : "+=1000"),
});

/**
 * Change the text on hovering over the services cards
 */

changeCursorTextOnLottie();

function changeCursorTextOnLottie() {
  const servicesCardsSection = document.querySelector(
    ".service-section-grid-2"
  );

  let timeoutId;
  const cursorTextNode = document.querySelector(
    ".custom-cursor-wrap .cursor-text"
  );

  servicesCardsSection.addEventListener("mouseover", () => {
    console.log("View More");
    cursorTextNode.innerText = "Know More";
  });

  servicesCardsSection.addEventListener("mouseleave", () => {
    console.log("Know More");
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      cursorTextNode.innerText = "View";
    }, 100);
  });
}
