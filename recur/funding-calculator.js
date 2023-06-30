let annualRecurringRevenue = 10000000;
let annualRevenueGrowth = 1;
let runwayValue = 1;

const values = {
  multiple: 5,
  valuation: 5,
  limitDuration: 0, // in months
  valuationYears: {
    V2: 0,
    V3: 0,
    V4: 0,
    V5: 0
  },
  limit: 0,
  discount: 8, // in percentage changable by admin
  roi: "15%", //in percentage changable by admin
  warrants: 0,
  costOfWarrants: 0,
  dilution: 0,
  recurClubCost: 0,
  ventureDebtCost: {
    interestCost: 0, // fixed for all 4 years [ROI*discound]
    warrantCost1: 0, // warrant cost for year 1
    warrantCost2: 0, // warrant cost for year 2
    warrantCost3: 0, // warrant cost for year 3
    warrantCost4: 0 // warrant cost for year 4
  },
  equity: {
    C1: 0,
    C2: 0,
    C3: 0,
    C4: 0
  }
};

// window.addEventListener("DOMContentLoaded", () => {
//   const paramUrl = window.location.search;
//   const params = new URLSearchParams(paramUrl);
//   const arrValue = params.get("annual_recurring_revenue");
//   const argValue = params.get("annual_revenue_growth");
//   annualRecurringRevenueSlider.setAttribute("aria-valuenow", arrValue);
// });

window.onload = () => {
  // adding form input change listeners;

  const recurringRevenueInput = document.querySelector(
    "[pd-custom-form='annual-recurring-revenue']"
  );
  const revenueGrowthInput = document.querySelector(
    "[pd-custom-form='annual-revenue-growth']"
  );
  const runwayInput = document.querySelector(
    "[pd-custom-form='annual-runway']"
  );
  const loader = document.querySelector("[pd-custom-code='loader']");

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
            recurringRevenueInput.value = "";
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
            revenueGrowthInput.value = "";
          }
        } else {
          let value = e.target.value;
          runwayValue = value;
          if (value > 24) {
            runwayValue = 24;
            runwayInput.value = 24;
          } else if (value < 1) {
            runwayValue = 1;
            runwayInput.value = "";
          }
        }
        // initialze the sliders
        initializeArrSlider(annualRecurringRevenue / 10000000);
        initializeArgSlider(annualRevenueGrowth);
        initializeRunwaySlider(runwayValue);
        recalculateValues();
      });
    }
  );

  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  // Get the values of the 'annual_recurring_revenue', 'annual_revenue_growth', and 'annual_runway' parameters
  const arrValueFromParam = urlParams.get("annual_recurring_revenue");
  const argValueFromParam = urlParams.get("annual_revenue_growth");
  const runwayValueFromParam = urlParams.get("annual_runway");
  if (arrValueFromParam || argValueFromParam || runwayValueFromParam) {
    annualRecurringRevenue = arrValueFromParam;
    annualRevenueGrowth = argValueFromParam;
    runwayValue = runwayValueFromParam;

    // initialze the sliders
    initializeArrSlider(annualRecurringRevenue / 10000000);
    initializeArgSlider(annualRevenueGrowth);
    initializeRunwaySlider(runwayValue);
    recalculateValues();

    loader.style.display = "none";
    showAndHideElements();
    hideAfterParams();
  } else {
    const submitBtn = document.querySelector("[data-form='submit-btn']");
    submitBtn.addEventListener("click", showAndHideElements);
  }

  loader.style.display = "none";
  document.querySelector("[pd-custom-code='after-loading']").style.display =
    "block";
};

function recalculateValues() {
  setLimitValue();
  // setting the discount value and the limit duration value
  setDurationAndDiscountvalue();
  capLimit(); //cap the limit to 30 Lakhs based on certain conditions and set tenure and discount too
  setAssumptions();
  setYearWiseValuation();
  setRecurClubCost();

  // interest Cost [same for all 4 Years]

  values.ventureDebtCost.interestCost =
    evaluatePercentage(values.roi) * values.limit;

  renderValuesToUi();
  renderRecurClubUi();

  // warrant Cost
  setWarrantCosts(); // on the venture debt Card
  renderVentureDebtUi(); //dependend on warrant costs

  // cost of equity card
  setCostOfEquity();
  renderEquityUi();
  setProjectedGrowth();
  setAdditionalGrowth();
}

function setDurationAndDiscountvalue() {
  if (annualRevenueGrowth > 50) {
    if (runwayValue <= 3) {
      values.discount = 3.2;
      values.limitDuration = 3;
    } else if (runwayValue > 3 && runwayValue <= 6) {
      values.discount = 5.6;
      values.limitDuration = 6;
    } else if (runwayValue > 6 && runwayValue <= 9) {
      values.discount = 7.8;
      values.limitDuration = 9;
    } else if (runwayValue > 9) {
      values.discount = 10;
      values.limitDuration = 12;
    }
  } else {
    if (runwayValue <= 3) {
      values.discount = 3.2;
      values.limitDuration = 3;
    } else if (runwayValue > 3 && runwayValue <= 6) {
      values.discount = 3.2;
      values.limitDuration = 3;
    } else if (runwayValue > 6 && runwayValue <= 9) {
      values.discount = 5.6;
      values.limitDuration = 6;
    } else if (runwayValue > 9 && runwayValue <= 12) {
      values.discount = 7.8;
      values.limitDuration = 9;
    } else if (runwayValue > 12) {
      values.discount = 10;
      values.limitDuration = 12;
    }
  }
}

function setLimitValue() {
  if (runwayValue >= 4) {
    if (annualRevenueGrowth >= 0 && annualRevenueGrowth < 50) {
      values.limit = evaluatePercentage(15) * annualRecurringRevenue;
    }
    if (annualRevenueGrowth >= 50 && annualRevenueGrowth < 100) {
      values.limit = evaluatePercentage(20) * annualRecurringRevenue;
    }
    if (annualRevenueGrowth === 100) {
      values.limit = evaluatePercentage(25) * annualRecurringRevenue;
    }
  }

  if (runwayValue < 4) {
    if (annualRevenueGrowth >= 0 && annualRevenueGrowth < 50) {
      values.limit = evaluatePercentage(10) * annualRecurringRevenue;
    }
    if (annualRevenueGrowth >= 50 && annualRevenueGrowth < 100) {
      values.limit = evaluatePercentage(10) * annualRecurringRevenue;
    }
    if (annualRevenueGrowth === 100) {
      values.limit = evaluatePercentage(10) * annualRecurringRevenue;
    }
  }
}

function capLimit() {
  if (
    (annualRevenueGrowth > 50 && runwayValue < 3) ||
    (annualRevenueGrowth <= 50 && runwayValue <= 6)
  ) {
    values.limitDuration = 6;
    values.limit = 3000000;
    values.discount = 3.2;
  }
}

function setRecurClubCost() {
  let cost =
    values.limit / (1 - evaluatePercentage(values.discount)) - values.limit;
  if (values.limitDuration === 3) {
    values.recurClubCost = cost * 4;
  } else if (values.limitDuration === 6) {
    values.recurClubCost = cost * 2;
  } else if (values.limitDuration === 9) {
    values.recurClubCost = cost * (4 / 3);
  } else if (values.limitDuration === 12) {
    values.recurClubCost = cost * 1;
  }
}
function renderRecurClubUi() {
  [
    "[rcf='amount-one']",
    "[rcf='amount-two']",
    "[rcf='amount-three']",
    "[rcf='amount-four']"
  ].forEach((el) => {
    document.querySelector(el).innerHTML = `₹${amountInWords(
      values.recurClubCost
    )}`;
  });
  const limitAmount = document.querySelector("[recur-club='limit-amount']");
  limitAmount.innerHTML = `${amountInWords(values.limit)} `;
  const discountNode = document.querySelector("[recur-club='discount-value']");
  discountNode.innerHTML = `${values.discount}%`;

  const recurClubGraphs = document.querySelectorAll(
    "[recur-club-finance='graph']"
  );

  // setting the width of recur club cost graph (1st card)
  const ventureDebtWarrantGraph = document.querySelector(
    "[venture-debt-warrant='graph-one']"
  );
  // setting the width based on the width of venture cost

  recurClubGraphs.forEach((graph) => {
    graph.style.width = `${ventureDebtWarrantGraph.offsetWidth - 7}px`;
  });
}

function renderVentureDebtUi() {
  [
    "[venture-debt='amount-one']",
    "[venture-debt='amount-two']",
    "[venture-debt='amount-three']",
    "[venture-debt='amount-four']"
  ].forEach((el, index) => {
    const amount = numberInWords(
      values.ventureDebtCost[`warrantCost${index + 1}`] +
        values.ventureDebtCost.interestCost
    );

    document.querySelector(el).innerHTML = `₹${amount}`;
  });
  document.querySelector("[venture-debt-warrant='graph-four']").style.width =
    "98%";
  const thirdGraphPercentage =
    values.ventureDebtCost.warrantCost3 / values.ventureDebtCost.warrantCost4;
  const secondGraphPercentage =
    values.ventureDebtCost.warrantCost2 / values.ventureDebtCost.warrantCost4;
  const firstGraphPercentage =
    values.ventureDebtCost.warrantCost1 / values.ventureDebtCost.warrantCost4;

  const limitAmount = document.querySelector("[venture-debt ='limit-amount']");
  limitAmount.innerHTML = `${amountInWords(values.limit)} `;
  document.querySelector(
    "[venture-debt-warrant='graph-three']"
  ).style.width = `${thirdGraphPercentage.toFixed(2) * 100}%`;
  document.querySelector("[venture-debt-warrant='graph-two']").style.width = `${
    secondGraphPercentage.toFixed(2) * 100
  }%`;
  document.querySelector("[venture-debt-warrant='graph-one']").style.width = `${
    firstGraphPercentage.toFixed(2) * 100
  }%`;
  const marginStat =
    (4 * evaluatePercentage(values.roi) * values.limit +
      values.ventureDebtCost.warrantCost4) /
    (4 * values.recurClubCost);

  document.querySelector(
    "[venture-debt='margin-stat']"
  ).innerHTML = `${marginStat.toFixed(0)}X`;
}

function renderEquityUi() {
  [
    "[equity-cost='amount-one']",
    "[equity-cost='amount-two']",
    "[equity-cost='amount-three']",
    "[equity-cost='amount-four']"
  ].forEach((el, index) => {
    const amount = numberInWords(values.equity[`C${index + 1}`]);
    document.querySelector(el).innerHTML = `₹${amount}`;
  });
  document.querySelector("[equity-cost='graph-four']").style.width = "95%";
  const thirdGraphPercentage = values.equity.C3 / values.equity.C4;
  const secondGraphPercentage = values.equity.C2 / values.equity.C4;
  const firstGraphPercentage = values.equity.C1 / values.equity.C4;
  document.querySelector("[equity-cost='graph-three']").style.width = `${
    thirdGraphPercentage.toFixed(2) * 100
  }%`;
  document.querySelector("[equity-cost='graph-two']").style.width = `${
    secondGraphPercentage.toFixed(2) * 100
  }%`;
  document.querySelector("[equity-cost='graph-one']").style.width = `${
    firstGraphPercentage.toFixed(2) * 100
  }%`;

  const limitAmount = document.querySelector("[equity-cost ='limit-amount']");
  limitAmount.innerHTML = `${amountInWords(values.limit)} `;

  const marginStat =
    values.equity.C4 /
    (4 *
      (values.limit / (1 - evaluatePercentage(values.discount)) -
        values.limit));
  document.querySelector(
    "[equity-cost='margin-stat']"
  ).innerHTML = `${marginStat.toFixed(0)}X`;

  document.querySelector(
    "[fd-custom-code='equity-dilution-value']"
  ).innerHTML = `${Number(values.dilution * 100).toFixed(2)}%`;
}

function setAssumptions() {
  values.valuation = values.multiple * annualRecurringRevenue;
  values.warrants = (0.2 * values.limit) / values.valuation;

  values.costOfWarrants =
    evaluatePercentage(annualRevenueGrowth) * values.warrants;
  values.dilution = values.limit / (values.valuation + values.limit);
}

function setYearWiseValuation() {
  const calculate = (val) =>
    val * (1 + evaluatePercentage(annualRevenueGrowth));

  values.valuationYears.V2 = calculate(values.valuation);
  values.valuationYears.V3 = calculate(values.valuationYears.V2);
  values.valuationYears.V4 = calculate(values.valuationYears.V3);
  values.valuationYears.V5 = calculate(values.valuationYears.V4);
}

function setWarrantCosts() {
  values.ventureDebtCost.warrantCost1 =
    0.1 * values.limit * evaluatePercentage(annualRevenueGrowth);
  const { V2, V3, V4 } = values.valuationYears;

  values.ventureDebtCost.warrantCost2 = Math.floor(
    values.warrants * V2 * evaluatePercentage(annualRevenueGrowth) +
      values.ventureDebtCost.warrantCost1
  );

  values.ventureDebtCost.warrantCost3 = Math.floor(
    values.warrants * V3 * evaluatePercentage(annualRevenueGrowth) +
      values.ventureDebtCost.warrantCost2
  );

  values.ventureDebtCost.warrantCost4 = Math.floor(
    values.warrants * V4 * evaluatePercentage(annualRevenueGrowth) +
      values.ventureDebtCost.warrantCost3
  );
}

function setCostOfEquity() {
  const { V2, V3, V4 } = values.valuationYears;

  values.equity.C1 =
    values.dilution *
    evaluatePercentage(annualRevenueGrowth) *
    values.valuation;
  values.equity.C2 =
    values.dilution * V2 * evaluatePercentage(annualRevenueGrowth) +
    values.equity.C1;
  values.equity.C3 =
    values.dilution * V3 * evaluatePercentage(annualRevenueGrowth) +
    values.equity.C2;
  values.equity.C4 =
    values.dilution * V4 * evaluatePercentage(annualRevenueGrowth) +
    values.equity.C3;
}

function evaluatePercentage(num) {
  const numericalPart = Number(
    num.toString().includes("%") ? num.replace("%", "") : num
  );
  return numericalPart / 100;
}

function roundToTwoDigits(num) {
  const roundedNum = Math.round(num * 100) / 100;
  return roundedNum.toFixed(2).padStart(4, "0");
}

function amountInWords(decimalNumber) {
  let roundOffvalue = roundToTwoDigits(Number(decimalNumber) / 10000000);
  const [beforePoint, afterPoint] = roundOffvalue.toString().split(".");
  if (Number(beforePoint) < 1) {
    return `${afterPoint}L`;
  } else {
    return `${beforePoint}.${afterPoint}Cr`;
  }
}

function renderValuesToUi() {
  const limitAmountInWordsNode = document.querySelector(
    '[pd-text="limit-amount-words"]'
  );
  const limitAmountInNumberNode = document.querySelector(
    '[pd-text="limit-amount-number"]'
  );
  const compareHeadlineLimitAmount = document.querySelector(
    '[compare-headline="limit-amount"]'
  );
  const limitDurationNode = document.querySelector(
    "[pd-custom-code='limit-duration']"
  );
  limitAmountInWordsNode.innerHTML = `${amountInWords(values.limit)} `;
  limitAmountInNumberNode.innerHTML = amountInNumber(values.limit);
  compareHeadlineLimitAmount.innerHTML = amountInWords(values.limit);
  limitDurationNode.innerHTML = values.limitDuration;
}

function amountInNumber(num) {
  let amountInDecimal = roundToTwoDigits(Number(num) / 10000000);
  const [beforePoint, afterPoint] = amountInDecimal.toString().split(".");
  if (beforePoint < 1) {
    return `${afterPoint},00,000`;
  } else {
    return `${beforePoint},${afterPoint},00,000`;
  }
}

function roundOff(num) {
  const [beforePoint, afterPoint] = num.toString().split(".");
  if (Number(afterPoint) < 50) {
    return `${beforePoint}`;
  } else {
    return `${beforePoint}.${afterPoint}`;
  }
}

function numberInWords(num) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + "Cr";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1) + "L";
  } else if (num >= 1000) {
    const data = (num / 1000).toFixed(1);
    const [beforePoint, afterPoint] = data.split(".");
    if (afterPoint === "0") {
      return `${beforePoint}L`;
    } else {
      return `${beforePoint}.${afterPoint}L`;
    }
  } else {
    return (num / 1000).toFixed(2);
  }
}

function hideAfterParams() {
  const elementToHide = document.querySelector(
    "[pd-custom-code='hide-after-params']"
  );
  const elementToShow = document.querySelector(
    "[pd-custom-code='show-after-params']"
  );
  elementToHide.style.display = "none";
  elementToShow.style.display = "block";
}

function showAndHideElements() {
  const elementsToHide = document.querySelectorAll(
    "[pd-custom='hide-after-submit']"
  );
  elementsToHide.forEach((el) => (el.style.display = "none"));
  const elementsToShow = document.querySelectorAll(
    "[pd-custom='show-after-submit']"
  );
  elementsToShow.forEach((el) => {
    el.style.display = "block";
  });
}

const monthlyRevenue = {
  r1: 0,
  r2: 0,
  r3: 0,
  r4: 0,
  r5: 0,
  r6: 0,
  r7: 0,
  r8: 0,
  r9: 0,
  r10: 0,
  r11: 0,
  r12: 0
};
const monthlyRevenuesBars = [
  ...document.querySelectorAll("[pd-custom-code='monthly-revenue']")
];

function setProjectedGrowth() {
  monthlyRevenue.r1 = annualRecurringRevenue / 12;
  monthlyRevenue.r2 = calculateGrowth(monthlyRevenue.r1);
  monthlyRevenue.r3 = calculateGrowth(monthlyRevenue.r2);
  monthlyRevenue.r4 = calculateGrowth(monthlyRevenue.r3);
  monthlyRevenue.r5 = calculateGrowth(monthlyRevenue.r4);
  monthlyRevenue.r6 = calculateGrowth(monthlyRevenue.r5);
  monthlyRevenue.r7 = calculateGrowth(monthlyRevenue.r6);
  monthlyRevenue.r8 = calculateGrowth(monthlyRevenue.r7);
  monthlyRevenue.r9 = calculateGrowth(monthlyRevenue.r8);
  monthlyRevenue.r10 = calculateGrowth(monthlyRevenue.r9);
  monthlyRevenue.r11 = calculateGrowth(monthlyRevenue.r10);
  monthlyRevenue.r12 = calculateGrowth(monthlyRevenue.r11);

  setGrowthGraph();
}

const heights = [
  "15",
  "24",
  "40",
  "52",
  "64",
  "76",
  "88",
  "104",
  "118",
  "133",
  "148",
  "160"
];
let timeoutId;
function setGrowthGraph() {
  clearTimeout(timeoutId);
  Object.keys(monthlyRevenue).forEach((key, index) => {
    // const height = calculateHeightPercentage(
    //   monthlyRevenue[key],
    //   monthlyRevenue.r12
    // );
    const animateFromHeight = generateRandomHeight(heights[index]);

    monthlyRevenuesBars[index].style.height = `${animateFromHeight}px`;

    // monthlyRevenuesBars[index].style.height = `${height - 40 + index * 1.8}%`;
    // monthlyRevenuesBars[index].style.height = `${height}%`;
  });

  timeoutId = setTimeout(() => {
    Object.keys(monthlyRevenue).forEach((key, index) => {
      monthlyRevenuesBars[index].style.height = `${heights[index]}px`;
    });
  }, 200);
}

function calculateHeightPercentage(value, maxValue) {
  return (value / maxValue).toFixed(2) * 100;
}

const additionalGrowth = {
  r1: 0,
  r2: 0,
  r3: 0,
  r4: 0,
  r5: 0,
  r6: 0,
  r7: 0,
  r8: 0,
  r9: 0,
  r10: 0,
  r11: 0,
  r12: 0
};

function setAdditionalGrowth() {
  const marketingSpend = 0.33 * values.limit;
  const roi = 0.1;
  const additionalRevenue = roi * marketingSpend;

  additionalGrowth.r1 = 0;
  additionalGrowth.r2 = additionalRevenue;
  additionalGrowth.r3 = calculateGrowth(additionalGrowth.r2);
  additionalGrowth.r4 = calculateGrowth(additionalGrowth.r3);
  additionalGrowth.r5 = calculateGrowth(additionalGrowth.r4);
  additionalGrowth.r6 = calculateGrowth(additionalGrowth.r5);
  additionalGrowth.r7 = calculateGrowth(additionalGrowth.r6);
  additionalGrowth.r8 = calculateGrowth(additionalGrowth.r7);
  additionalGrowth.r9 = calculateGrowth(additionalGrowth.r8);
  additionalGrowth.r10 = calculateGrowth(additionalGrowth.r9);
  additionalGrowth.r11 = calculateGrowth(additionalGrowth.r10);
  additionalGrowth.r12 = calculateGrowth(additionalGrowth.r11);

  setAdditionalGrowthValue();
}

const allAdditionalGrowths = [
  ...document.querySelectorAll("[pd-custom-code='additional-growth-value']")
];

const additionalGrowthHeights = [
  "5",
  "7",
  "9",
  "10",
  "12",
  "13.5",
  "14.7",
  "15.8",
  "17",
  "18.1",
  "19.2",
  "20.8"
];
function setAdditionalGrowthValue() {
  const additionalGrowthbars = [
    ...document.querySelectorAll("[pd-custom-code='additional-growth-bar']")
  ];
  Object.keys(additionalGrowth).forEach((key, index) => {
    allAdditionalGrowths[index].innerHTML = convertToIndianNumberFormat(
      additionalGrowth[key]
    );
    additionalGrowthbars[
      index
    ].style.minHeight = `${additionalGrowthHeights[index]}px`;
  });
}

setMonthsName();

function calculateGrowth(num) {
  return num * (1 + evaluatePercentage(annualRevenueGrowth / 12));
}

// setting months
function setMonthsName() {
  const months = getMonths();
  const monthNodes = document.querySelectorAll("[pd-custom-code='month-year']");
  months.forEach((month, index) => {
    monthNodes[index].innerHTML = month;
  });
}

function convertToIndianNumberFormat(number) {
  if (number >= 10000000) {
    const crores = number / 10000000;
    return crores.toFixed(1) + "Cr";
  } else if (number >= 100000) {
    const lakhs = number / 100000;
    return lakhs.toFixed(1) + "L";
  } else {
    const thousands = number / 1000;
    return thousands.toFixed(1) + "K"; // Return the number as is if it's less than 1 lakh
  }
}

function getMonths() {
  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  var currentYear = currentDate.getFullYear();

  var nextYearDate = new Date(currentYear + 1, currentMonth, 1);
  var nextYearMonth = nextYearDate.getMonth();

  var months = [];
  var month = currentMonth;
  var year = currentYear;

  while (!(year === nextYearDate.getFullYear() && month === nextYearMonth)) {
    var monthName = new Date(year, month, 1).toLocaleString("default", {
      month: "short"
    });
    months.push(`${monthName}'${year.toString().slice(2)}`);

    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return months;
}

function generateRandomHeight(num) {
  // Generate a random number between 0 and 1
  var random = Math.random();

  // Determine whether to increase or decrease the number
  if (random < 0.4) {
    return Number(num) > 90
      ? Number(num) + 100
      : Number(num) === 15
      ? Number(num) + 15
      : Number(num) + 26; // Increase the number by 13
  } else {
    return Number(num) > 90
      ? Number(num) - 100
      : Number(num) === 15
      ? Number(num) - 15
      : Number(num) - 26; // Decrease the number by 13
  }
}

function initializeArrSlider(value) {
  document.querySelector(
    "[pd-custom-code='arr-display-value']"
  ).innerHTML = value;

  $("[pd-custom-code='arr-range-slider']").slider({
    range: "min",
    min: 1, // Minimum value
    max: 100, // Maximum value
    value,
    // values: [25, 75], // Initial range values
    slide: function (event, ui) {
      const { value } = ui;
      annualRecurringRevenue = value * 10000000;
      document.querySelector(
        "[pd-custom-code='arr-display-value']"
      ).innerHTML = value;
      recalculateValues();
      // Callback function to handle the slide event
      // Do something with the selected values
    }
  });
}
function initializeArgSlider(value) {
  document.querySelector(
    "[pd-custom-code='arg-display-value']"
  ).innerHTML = value;
  $("[pd-custom-code='arg-range-slider']").slider({
    range: "min",
    min: 1, // Minimum value
    max: 100, // Maximum value
    value,
    // values: [25, 75], // Initial range values
    slide: function (event, ui) {
      const { value } = ui;
      annualRevenueGrowth = value;
      document.querySelector(
        "[pd-custom-code='arg-display-value']"
      ).innerHTML = value;
      recalculateValues();
      // Callback function to handle the slide event
      // Do something with the selected values
    }
  });
}
function initializeRunwaySlider(value) {
  document.querySelector(
    "[pd-custom-code='runway-display-value']"
  ).innerHTML = value;
  $("[pd-custom-code='runway-range-slider']").slider({
    range: "min",
    min: 1, // Minimum value
    max: 24, // Maximum value
    value,
    // values: [25, 75], // Initial range values
    slide: function (event, ui) {
      const { value } = ui;
      runwayValue = value;
      document.querySelector(
        "[pd-custom-code='runway-display-value']"
      ).innerHTML = value;
      recalculateValues();
      // Callback function to handle the slide event
      // Do something with the selected values
    }
  });
}
