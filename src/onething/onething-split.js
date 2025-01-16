document.addEventListener("DOMContentLoaded", () => {
  const splitAnimationWrappers = document.querySelectorAll(
    "[split-animation-wrapper]"
  );

  splitAnimationWrappers.forEach((wrapper) => {
    const text = new SplitType(wrapper.querySelectorAll("[split-text]"), {
      types: "lines,words",
    });

    const target = wrapper;
    let anim;

    // const splitTextHeading = wrapper.querySelector("[split-text]");

    const headingWords = gsap.utils.toArray(text.words);

    const threshold = 0.6;

    const options = {
      root: null, // Use the viewport as the container
      rootMargin: "0px",
      threshold, // Trigger when 60% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Intersecting ");
          anim = animateSplitText(text);
          observer.unobserve(target); // Stop observing after animation
        }
      });
    }, options);

    observer.observe(target);

    let previousWidth = wrapper.clientWidth;

    // Reposition text after the container is resized
    const resizeObserver = new ResizeObserver(
      debounce(([entry]) => {
        const currentWidth = entry.contentRect.width;

        // Only call split if the width has changed
        if (currentWidth !== previousWidth) {
          console.log("resized ");

          previousWidth = currentWidth; // Update the previous width
          text.split();
          if (anim) {
            anim.kill();
          }
          observer.observe(target); // Stop observing after animation
        }
      }, 500)
    );
    resizeObserver.observe(wrapper);
  });

  function animateSplitText(text) {
    const headingWords = gsap.utils.toArray(text.words);
    console.log(headingWords);
    let anim = gsap.to(headingWords, {
      y: 0,
      x: 0,
      duration: 1.2,
      ease: "power1.out",
      onStart: () => {
        console.log("played");
      },
      stagger: { amount: 0.15 },
    });

    return anim;
  }

  function debounce(func, wait) {
    let timeout;

    return function (...args) {
      const context = this;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
});
