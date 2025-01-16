const crewSection = document.querySelector(".section_crew");

const crewCards = document.querySelectorAll(".crew-card");

const crewComponent = document.querySelector("[fd-code='crew-component']");
const crewSlide = document.querySelector("[fd-code='crew-slide']");

let { tl, textsTimeline } = setupCareersAnimation();

function setupCareersAnimation() {
  const tl = gsap.timeline();

  tl.to(
    crewComponent,
    {
      x: () => getTranslateValue(),
    },
    "label"
  );

  const textsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: crewSection.querySelector(".container-large"),
      start: "top 300px",
      scrub: true,
      // end: () => "650px",
      end: () => "+=1100",
      // ease: "power2.out",
    },
  });

  crewCards.forEach((card, i) => {
    const headings = card.querySelectorAll(".crew-card_title div");
    const paragraphs = card.querySelector("div p");
    // const label = i === 0 ? "label" : `label+=${i * 0.5}`;
    textsTimeline
      .from(headings, {
        opacity: 0,
        y: 40,
        stagger: 0.1,
      })
      .from(
        paragraphs,
        {
          opacity: 0,
          y: 20,
        },
        ">-0.2"
      );
  });

  ScrollTrigger.create({
    animation: tl,
    trigger: crewComponent,
    pin: true,
    start: "top 130px",
    end: () => "+=1650px",
    scrub: 1,
    invalidateOnRefresh: true,
  });

  return {
    tl,
    textsTimeline,
  };
}

if (window.innerWidth < 992) {
  killAnimation();
}

window.addEventListener("resize", () => {
  if (tl && window.innerWidth < 992) {
    killAnimation();
  } else {
    if (!tl?.scrollTrigger) {
      ({ tl, textsTimeline } = setupCareersAnimation());
    }
  }
});

function killAnimation() {
  tl.kill();
  textsTimeline.kill();

  crewCards.forEach((card, i) => {
    const headings = card.querySelectorAll(".crew-card_title div");
    const paragraphs = card.querySelector("div p");

    gsap.set(headings, {
      clearProps: true,
    });
    gsap.set(paragraphs, {
      clearProps: true,
    });
  });
}

function getTranslateValue() {
  if (window.innerWidth >= 1440) {
    return `-${crewSlide.offsetWidth * 1.2 - 10}px`;
  }

  let sum = 0;

  const cards = document.querySelectorAll(".crew-card");
  cards.forEach((card) => {
    sum += card.offsetWidth;
  });
  sum += 24 * cards.length - 1;
  sum -= 40;
  sum -= document.querySelector(".navbar4_container").offsetWidth / 2;

  return `-${sum}px`;
}

document.querySelectorAll(".crew-card.w-dyn-item").forEach((card) => {
  // card.querySelector(".crew-img").style.display = "block";
  // const glitchWrap = card.querySelector(".glitch");
  // const backgroundImage = card.querySelector(".crew-img").src;
  // glitchWrap.innerHTML = `
  //   <div class='glitch__img' style='visibility : hidden; opacity : 0; background: url(${backgroundImage}) no-repeat' ></div>
  //   <div class='glitch__img' style='visibility : hidden; background: url(${backgroundImage}) no-repeat' ></div>
  //   <div class='glitch__img' style='visibility : hidden; background: url(${backgroundImage}) no-repeat' ></div>
  //   <div class='glitch__img' style='visibility : hidden; background: url(${backgroundImage}) no-repeat' ></div>
  //   <div class='glitch__img' style='visibility : hidden; background: url(${backgroundImage}) no-repeat' ></div>
  // `;
  // const images = card.querySelectorAll(".glitch__img");
  // images.forEach((img) => {
  //   img.style.width = `${card.querySelector(".crew-img").offsetWidth}px`;
  //   img.style.height = `${card.querySelector(".crew-img").offsetHeight}px`;
  // });
  // let intervalId;
  // let timeoutId;
  // card.addEventListener("mouseenter", () => {
  //   clearInterval(intervalId);
  //   clearTimeout(timeoutId);
  //   console.log("mouseover");
  //   const images = card.querySelectorAll(".glitch__img");
  //   images.forEach((img) => {
  //     img.style.visibility = "visible";
  //   });
  //   images[1].style.animationName = "glitch-anim-1";
  //   images[2].style.animationName = "glitch-anim-2";
  //   images[3].style.animationName = "glitch-anim-3";
  //   images[4].style.animationName = "glitch-anim-flash";
  //   // intervalId = setInterval(() => {
  //   //   images.forEach((img) => {
  //   //     img.style.animationName = "null";
  //   //     img.style.visibility = "hidden";
  //   //   });
  //   //   console.log("starting");
  //   //   images[1].style.animationName = "glitch-anim-1";
  //   //   images[2].style.animationName = "glitch-anim-2";
  //   //   images[3].style.animationName = "glitch-anim-3";
  //   //   images[4].style.animationName = "glitch-anim-flash";
  //   // }, 1500);
  //   intervalId = setInterval(() => {
  //     console.log("doingg");
  //     const images = card.querySelectorAll(".glitch__img");
  //     images.forEach((img) => {
  //       img.style.animationName = "null";
  //       img.style.visibility = "hidden";
  //     });
  //     timeoutId = setTimeout(() => {
  //       const images = card.querySelectorAll(".glitch__img");
  //       images.forEach((img) => {
  //         img.style.visibility = "visible";
  //       });
  //       images[1].style.animationName = "glitch-anim-1";
  //       images[2].style.animationName = "glitch-anim-2";
  //       images[3].style.animationName = "glitch-anim-3";
  //       images[4].style.animationName = "glitch-anim-flash";
  //     }, 10);
  //   }, 1900);
  // });
  // card.addEventListener("mouseleave", () => {
  //   const images = card.querySelectorAll(".glitch__img");
  //   images.forEach((img) => {
  //     img.style.animationName = "null";
  //     img.style.visibility = "hidden";
  //   });
  //   clearInterval(intervalId);
  // });
  // adjust width of the crew image
  // const widthOfGlitchImage = card.querySelector(".glitch__img").offsetWidth;
  // const heightOfGlitchImage = card.querySelector(".glitch__img").offsetHeight;
  // console.log({ widthOfGlitchImage, heightOfGlitchImage });
});
