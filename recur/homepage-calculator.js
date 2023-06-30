const recurringRevenueInput = document.querySelector(
  "[pd-custom-form='annual-recurring-revenue']"
);
const revenueGrowthInput = document.querySelector(
  "[pd-custom-form='annual-revenue-growth']"
);
const runwayInput = document.querySelector("[pd-custom-form='annual-runway']");
let annualRecurringRevenue = 10000000;
let annualRevenueGrowth = 1;
let runwayValue = 4;

[recurringRevenueInput, revenueGrowthInput, runwayInput].forEach(
  (el, index) => {
    el.addEventListener("input", (e) => {
      if (index === 0) {
        let value = e.target.value;
        annualRecurringRevenue = value * 10000000;
        // check for max value input
        if (value > 100) {
          annualRecurringRevenue = 100 * 10000000;
          recurringRevenueInput.value = 100;
        } else if (value < 1) {
          annualRecurringRevenue = 10000000;
        }
      } else if (index === 1) {
        let value = e.target.value;
        annualRevenueGrowth = value;
        // chheck for maximum possible value
        if (value > 100) {
          annualRevenueGrowth = 100;
          revenueGrowthInput.value = 100;
        } else if (value < 1) {
          annualRevenueGrowth = 1;
        }
      } else {
        let value = e.target.value;
        runwayValue = value;
        if (value > 24) {
          runwayValue = 24;
          runwayInput.value = 24;
        } else if (value < 4) {
          runwayValue = 4;
        }
      }
    });
  }
);

const submitBtn = document.querySelector(
  '[pd-custom-form = "submit-btn-redirect"]'
);

submitBtn.addEventListener("click", handleClick);

function handleClick() {
  window.location.href = `https://recur-club.webflow.io/funding-calculator?annual_recurring_revenue=${annualRecurringRevenue}&annual_revenue_growth=${annualRevenueGrowth}&annual_runway=${runwayValue}`;
}
