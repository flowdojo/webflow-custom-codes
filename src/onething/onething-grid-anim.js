document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  const oneionsSection = document.querySelector(".oneonions-section");
  gsap.set(oneionsSection.querySelector(".grain-div"), {
    zIndex: 1,
    opacity: 0.08,
  });
  gsap.set(oneionsSection.querySelector(".grain-div-3"), {
    opacity: 0.08,
  });
  const cards = [
    ...document.querySelectorAll(".oneonions-section .oneions-wrapper"),
  ];

  if (window.innerWidth > 767) {
    console.log("setting up desktop animation");
    setupDesktopOneionAnimation();
  } else {
    setupMobileOneionAnimation();
  }

  function setupMobileOneionAnimation() {
    let cardHeight = cards[0].offsetHeight;
    let cardWidth = cards[0].offsetWidth;

    const oneionSection = document.querySelector(".oneonions-section");
    // Set Height Of the Section
    oneionSection.style.height = `${getOneionSectionHeight()}px`;

    const firstThreeCards = cards.slice(0, 3);

    const remainingCards = cards.slice(3);

    gsap.set(firstThreeCards, {
      y: oneionSection.offsetHeight,
      xPercent: 50,
      zIndex: 2,
      left: "-10px",
    });

    gsap.set(remainingCards, {
      y: window.innerHeight / 2 - cardHeight / 2,
      xPercent: 50,
      visibility: "hidden",
      left: "-10px",
    });

    // pinning the section before the animation begins, for about 3000 pixels
    // Create a timeline
    const tl = gsap.timeline({});

    // Animate firstThreecards
    tl.to(firstThreeCards, {
      y: window.innerHeight / 2 - cardHeight / 2,
      xPercent: 50,
      duration: 5,
      stagger: 1.6,
      ease: "power1.out",
    });

    const positions = [
      {
        y: -20,
        x: -(cardWidth / 2) - 10,
      },
      {
        y: 20,
        x: cardWidth / 2 + 10,
      },
      {
        y: cardHeight,
        x: -(cardWidth / 2) - 12,
      },
    ];

    const spreadTl = gsap.timeline();

    firstThreeCards.forEach((project, index) => {
      spreadTl.to(
        project,
        {
          // y: index * 1.05 * cardHeight - 50,
          // x: cardWidth / 2 + 20,
          y: positions[index].y,
          x: positions[index].x,
          duration: 5,
          onStart: () => {
            gsap.set(remainingCards, {
              visibility: "visible",
            });
          },
          ease: "none",
        },
        "spread"
      );
    });

    const overlayTimeline = getOverlayTimeline();
    const textFadeTl = getTextFadeTimeline();
    textFadeTl.paused(true); // Ensure the timeline is paused

    spreadTl.add(overlayTimeline, "spread");
    // After firstThreecards animation, start remainingcards animation
    remainingCards.forEach((project, index) => {
      const opacity = index > remainingCards.length - 1 ? 0 : 1;
      console.log({ opacity });
      let i = getNewIndex(index);
      let x = index < 7 ? -(cardWidth / 2) - 12 : cardWidth / 2 + 10;
      let additionValue = index > 6 ? cardHeight + 40 : cardHeight * 2 + 20;

      let y = i * cardHeight + i * 20 + additionValue;

      gsap.set(project, {
        opacity,
        zIndex: index > remainingCards.length - 1 ? -1 : 1,
      });

      spreadTl.to(
        project,
        {
          x: x,
          y,
          onReverseComplete: () => {
            gsap.set(project, {
              visibility: "hidden",
            });
          },
          duration: 5,
          ease: "none",
        },
        "spread"
      ); // "<" starts the animation right after the previous one
    });

    spreadTl.timeScale(0.8);

    // spreadTl.to(cards, { duration: 6 }, "spread");
    tl.add(spreadTl, "spread");

    const temp = gsap.timeline();
    temp.to(cards, { duration: 7, ease: "power3.out" });
    tl.add(temp, "spread");

    ScrollTrigger.create({
      animation: tl,
      trigger: ".oneonions-section",
      scrub: 1,
      start: "top top",
      trigger: ".oneonions-section",
      pin: true,
      ease: "power4.inOut",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        textFadeTl.time(self.progress * textFadeTl.totalDuration());

        if (self.progress > 0.95) {
          gsap.set(cards, {
            pointerEvents: "auto",
          });
          gsap.set(".oneions-content-wrap", {
            visibility: "hidden",
          });
        } else {
          gsap.set(cards, {
            pointerEvents: "none",
          });
          gsap.set(".oneions-content-wrap", {
            visibility: "visible",
          });
        }
      },
    });
  }

  function setupDesktopOneionAnimation() {
    gsap.set(cards, {
      visibility: "hidden",
      mixBlendMode: "normal",
    });

    const filtered = [...cards].slice(3);

    const tl = gsap.timeline({
      onStart: () => {
        gsap.set(cards, {
          visibility: "visible",
        });
        gsap.set(filtered, {
          visibility: "hidden",
          zIndex: 0,
        });
      },
    });
    tl.fromTo(
      cards[0],
      { top: "150%", left: "50vw" },
      {
        top: () => "50vh",
        left: () => "50vw",
        duration: 1.2,
        ease: "power2.out",
      }
    )
      .fromTo(
        cards[1],
        { top: "150%", left: "50vw" },
        {
          top: () => "50vh",
          left: () => "50vw",
          duration: 1.2,
          ease: "power2.out",
          // delay: 0.7,
        },
        ">-0.7"
      )
      .fromTo(
        cards[2],
        { top: "150%", left: "50vw" },
        {
          top: () => "50vh",
          left: () => "50vw",
          duration: 1.2,
          ease: "power2.out",
          // delay: 1.2,
        },
        ">-0.7"
      );

    // STACK TIMELINE
    const timelines = filtered.map((el, index) => {
      const tl = gsap.timeline({
        onStart: () => {
          gsap.set(el, {
            visibility: "visible",
          });
        },
        onReverseComplete: () => {
          gsap.set(el, {
            visibility: "hidden",
          });
        },
      });

      tl.fromTo(
        el,
        {
          left: () => "50vw",
          top: () => "50vh",
          // xPercent: "-50%",
          // yPercent: "-50%",
        },
        {
          left: () => getGridCardValues()[index]?.left || "130vw",
          top: () => getGridCardValues()[index]?.top || "50vh",
          duration: 1.2,
          ease: "power2.inOut",
        }
      );
      return tl;
    });

    const firstThreeProjectTl = getFirstThreeProjectTl();
    const overlayTimeline = getOverlayTimeline();
    const textFadeTl = getTextFadeTimeline();

    textFadeTl.paused(true); // Ensure the timeline is paused

    tl.add(firstThreeProjectTl, "start");
    tl.add(timelines, "start");
    tl.add(overlayTimeline, "start");

    ScrollTrigger.create({
      animation: tl,
      trigger: oneionsSection,
      start: "top top",
      end: () =>
        window.innerWidth < 768
          ? "bottom bottom"
          : oneionsSection.offsetHeight * 3,
      pin: ".oneonions-section",
      scrub: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      ease: window.innerWidth > 767 ? "power2.inOut" : "power4.out",
      onUpdate: (self) => {
        textFadeTl.time(self.progress * textFadeTl.totalDuration());

        if (self.progress > 0.95) {
          gsap.set(cards, {
            pointerEvents: "auto",
          });
          gsap.set(".oneions-content-wrap", {
            visibility: "hidden",
          });
        } else {
          gsap.set(cards, {
            pointerEvents: "none",
          });
          gsap.set(".oneions-content-wrap", {
            visibility: "visible",
          });
        }
      },
    });

    function getFirstThreeProjectTl() {
      const desktopValues = [
        { top: "40vw", left: "50vw" },
        { top: "73vw", left: "50vw" },
        { top: "44vw", left: "76vw" },
      ];
      const tabletValues = [
        { top: "51vh", left: "50vw" },
        { top: "11vh", left: "87vw" },
        { top: "17vh", left: "13vw" },
      ];

      let values;
      if (window.innerWidth >= 992) {
        values = desktopValues;
      } else if (window.innerWidth >= 768) {
        values = tabletValues;
      } else {
        values = mobileValues;
      }

      return [cards[0], cards[1], cards[2]].map((el, i) => {
        const tl = gsap.timeline();
        tl.to(el, {
          top: () => values[i].top,
          left: () => values[i].left,
          duration: 1.2, // Add a duration
          ease: "power2.inOut", // Add an ease function
          // duration: 1.5,
        });

        return tl;
      });
    }
  }

  function getTextFadeTimeline() {
    const tl = gsap.timeline();
    tl.set(".oneions-text-wrap", { opacity: 1 }); // Ensure
    tl.fromTo(
      ".oneions-text-wrap",
      {
        opacity: 1,
      },
      {
        opacity: 0,
        ease: "power4.in",
      }
    );
    return tl;
  }
  function getOverlayTimeline() {
    const tl = gsap.timeline();
    const overlays = [...cards].map((project) =>
      project.querySelector(".onions-overlay")
    );
    tl.fromTo(
      overlays,
      {
        opacity: 0,
      },
      {
        opacity: 1,
      }
    ).fromTo(
      ".onenions-overlay",
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
      "<"
    );

    return tl;
  }

  function getGridCardValues() {
    const desktopValues = [
      { left: "-2vw", top: "5vw" },
      { left: "-2vw", top: "37vw" },
      { left: "-2vw", top: "70vw" },

      { left: "24vw", top: "11vw" },
      { left: "24vw", top: "44vw" },
      { left: "24vw", top: "77vw" },

      { left: "76vw", top: "11vw" },
      { left: "76vw", top: "77vw" },

      { left: "102vw", top: "5vw" },
      { left: "102vw", top: "38vw" },
      { left: "102vw", top: "71vw" },

      { left: "50vw", top: "7vw" },
      { left: "102vw", top: "104vw" },
      { left: "26vw", top: "130vw" },

      { left: "-2vw", top: "103vw" },
    ];

    const tabletValues = [
      { left: "13vw", top: "60vh" },
      { left: "13vw", top: "103vh" },
      { left: "50vw", top: "8vh" },

      { left: "50vw", top: "94vh" },
      { left: "87vw", top: "54vh" },
      { left: "87vw", top: "97vh" },

      { left: "120vw", top: "2vw" },
      { left: "-25vw", top: "66vw" },

      { left: "120vw", top: "2vw" },
      { left: "-25vw", top: "66vw" },
      { left: "120vw", top: "2vw" },
      { left: "-25vw", top: "66vw" },
      { left: "120vw", top: "2vw" },
      { left: "-25vw", top: "66vw" },
      { left: "120vw", top: "2vw" },
      { left: "-25vw", top: "66vw" },
    ];

    if (window.innerWidth >= 992) {
      return desktopValues;
    } else if (window.innerWidth >= 768) {
      return tabletValues;
    } else {
      return mobileValues;
    }
  }

  function getOneionSectionHeight() {
    const cardHeight = cards[0].offsetHeight;
    return cardHeight * (cards.length / 2) + cardHeight * 0.5 + 40;
  }

  function getNewIndex(index) {
    if (index < 7) return index;

    return index - 7;
  }

  // function getDefaultGridValues() {
  //   if (window.innerWidth >= 992) {
  //     return { top: "98vw", left: "26vw" };
  //   } else if (window.innerWidth >= 768) {
  //     return { top: "98vw", left: "-20vw" };
  //   } else {
  //     return { top: "98vw", left: "26vw" };
  //   }
  // }
});

setUpMutationObserver();

function setUpMutationObserver() {
  // Select the node that will be observed for mutations
  const joinPackButton = document.getElementById("oneion-join-pack");
  const targetNode = document.body;

  // Options for the observer (which mutations to observe)
  const config = { attributes: true };
  const allOneionsOverlay = document.querySelectorAll(".oneion-absolute");

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        joinPackButton.style.backgroundColor = bgColor;

        allOneionsOverlay.forEach((overlay) => {
          overlay.style.backgroundColor = bgColor;
        });
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

/**
 * Shift THE text downwards for MACOS
 */

if (window.navigator.platform.indexOf("Mac") != -1) {
  if (window.innerWidth > 767) {
    document.querySelector(".oneion-heading.the-text").style.transform =
      "translateY(12px)";
  }
}
