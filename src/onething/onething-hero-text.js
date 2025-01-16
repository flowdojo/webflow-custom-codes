// tr-scrollflip-element=target
// attribute value checker
function attr(defaultVal, attrVal) {
  const defaultValType = typeof defaultVal;
  if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
  if (attrVal === "true" && defaultValType === "boolean") return true;
  if (attrVal === "false" && defaultValType === "boolean") return false;
  if (isNaN(attrVal) && defaultValType === "string") return attrVal;
  if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
  return defaultVal;
}

function setUpVideoFlip() {
  // scrollflip component
  $("[tr-scrollflip-element='component']").each(function (index) {
    let componentEl = $(this),
      originEl = componentEl.find("[tr-scrollflip-element='origin']"),
      targetEl = componentEl.find("[tr-scrollflip-element='target']"),
      scrubStartEl = componentEl.find("[tr-scrollflip-scrubstart]"),
      scrubEndEl = componentEl.find("[tr-scrollflip-scrubend]");
    let startSetting = attr(
        "top top",
        scrubStartEl.attr("tr-scrollflip-scrubstart")
      ),
      endSetting = attr(
        "bottom bottom",
        scrubEndEl.attr("tr-scrollflip-scrubend")
      ),
      staggerSpeedSetting = attr(
        0,
        componentEl.attr("tr-scrollflip-staggerspeed")
      ),
      staggerDirectionSetting = attr(
        "start",
        componentEl.attr("tr-scrollflip-staggerdirection")
      ),
      scaleSetting = attr(false, componentEl.attr("tr-scrollflip-scale")),
      breakpointSetting = attr(0, componentEl.attr("tr-scrollflip-breakpoint"));
    let componentIndex = index,
      timeline,
      resizeTimer;
    // asign matching data flip ids
    originEl.each(function (index) {
      let flipId = `${componentIndex}-${index}`;
      $(this).attr("data-flip-id", flipId);
      targetEl.eq(index).attr("data-flip-id", flipId);
    });
    // create timeline
    function createTimeline() {
      if (timeline) {
        timeline.kill();
        gsap.set(targetEl, { clearProps: "all" });
        gsap.set(targetEl, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        });
      }
      // $("body").addClass("scrollflip-relative");
      gsap.matchMedia().add(`(min-width: ${breakpointSetting}px)`, () => {
        const state = Flip.getState(originEl);
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scrubStartEl,
            endTrigger: scrubEndEl,
            start: startSetting,
            end: endSetting,
            scrub: true,
          },
        });
        timeline.add(
          Flip.from(state, {
            targets: targetEl,
            scale: scaleSetting,
            stagger: {
              amount: staggerSpeedSetting,
              from: staggerDirectionSetting,
            },
          })
        );
      });
      // $("body").removeClass("scrollflip-relative");
    }
    createTimeline();
    // update on window resize
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        createTimeline();
      }, 250);
    });
  });
}
