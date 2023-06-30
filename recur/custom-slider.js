const paramsButtonCTA = document.querySelector(
  '[pd-slider="param-redirect-btn"]'
);

const slidersWrapper = document.querySelectorAll(
  "[pd-custom-code='slider-wrapper']"
);
let annualRecurringRevenue = 1,
  annualRevenueGrowth = 1,
  runwayValue = 4;

slidersWrapper.forEach((sliderWrapper) => {
  const slider = sliderWrapper.querySelector("[pd-custom-code='slider']");
  const circle = sliderWrapper.querySelector(".slider-circle");
  const background = sliderWrapper.querySelector(".background");
  const valueIndicator = sliderWrapper.querySelector(".value");

  // Update the value of the slider when the circle is dragged
  circle.addEventListener("mousedown", startDragging);
  circle.addEventListener("touchstart", startDragging);

  function startDragging() {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);
  }

  function onMouseMove(event) {
    updateSliderValue(event.clientX);
  }

  function onTouchMove(event) {
    updateSliderValue(event.touches[0].clientX);
  }

  function updateSliderValue(clientX) {
    const sliderRect = slider.getBoundingClientRect();
    const position = (clientX - sliderRect.left) / sliderRect.width;
    if (position >= 0 && position <= 1) {
      slider.value = Math.round(position * slider.max);
      circle.style.left = `${position * 100}%`;
      background.style.width = `${position * 100}%`;
      valueIndicator.innerText = slider.value;
      updateValues(slider);
    }
  }

  function stopDragging() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("mouseup", stopDragging);
    document.removeEventListener("touchend", stopDragging);
  }
});

function updateValues(slider) {
  const targetSlider = slider.getAttribute("pd-slider");
  const targetSliderValue = slider.value;
  console.log("target slider ", targetSlider);
  if (targetSlider === "annual-recurring-revenue") {
    annualRecurringRevenue = targetSliderValue;
  }

  if (targetSlider === "annual-revenue-growth") {
    annualRevenueGrowth = targetSliderValue;
  }
  if (targetSlider === "runway") {
    runwayValue = targetSliderValue;
  }
}

paramsButtonCTA?.addEventListener("click", function () {
  let url = `/funding-calculator?annual_recurring_revenue=${
    annualRecurringRevenue * 10000000
  }&annual_revenue_growth=${annualRevenueGrowth}&annual_runway=${runwayValue}`;

  window.open(url, "_blank");
});
