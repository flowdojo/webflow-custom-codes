"use strict";

window.Webflow ||= [];
window.Webflow.push(() => {
  const selectedPlan = PlanTypeController();

  const callPlanTenureType = TenureTypeController();
  const unlimitedPlanTenureType = TenureTypeController();
  const planTypeFilters = document.querySelectorAll(
    "[fd-code='plan-type-filters']>div"
  );

  const callPlanTenureDropdown = document.querySelector(
    "[fd-dropdown='call-plan']"
  );

  const unlimitedPlanTenureDropdown = document.querySelector(
    "[fd-dropdown='unlimited-plan']"
  );

  // change pricing on load
  handlePricingChange();

  planTypeFilters.forEach((filter) => {
    const planFilterText = filter.querySelector("div").innerText.trim();
    filter.addEventListener("click", () => {
      planTypeFilters.forEach(removeIsActiveClass);
      addIsActiveClass(filter);
      selectedPlan.set(planFilterText);
      if (planFilterText === "CALL PLAN") {
        addHideClass(document.querySelector(".tenure-filter.unlimited-plan"));
        removeHideClass(document.querySelector(".tenure-filter.call-plan"));
      } else {
        addHideClass(document.querySelector(".tenure-filter.call-plan"));
        removeHideClass(
          document.querySelector(".tenure-filter.unlimited-plan")
        );
      }
      handlePricingChange();
    });
  });

  callPlanTenureDropdown.addEventListener("change", (e) => {
    const { value } = e.target;
    callPlanTenureType.set(value.trim());
    handlePricingChange();
  });

  unlimitedPlanTenureDropdown.addEventListener("change", (e) => {
    const { value } = e.target;
    unlimitedPlanTenureType.set(value.trim());
    handlePricingChange();
  });

  function handlePricingChange() {
    const currentPlanType = selectedPlan.get();

    const currentTenure =
      currentPlanType === "CALL PLAN"
        ? callPlanTenureType.get()
        : unlimitedPlanTenureType.get();

    const PRICING_PLAN = {
      "CALL PLAN": {
        Quaterly: {
          starter: "NA",
          growth: "1,800/month | 5,400/quarter",
          professional: "3,000/month | 9,000/quarter",
        },
        "Half-Yearly": {
          starter: "1,200/month | 7,200/half-year",
          growth: "1,700/month | 10,200/half-year",
          professional: "2,700/month | 16,200/half-year",
        },
        Annually: {
          starter: "1,000/month | 12,000/year",
          growth: "1,500/month | 18,000/year",
          professional: "2,500/month | 30,000/year",
        },
      },

      "UNLIMITED PLAN": {
        Quaterly: {
          starter: "1,200/agent/month | 3,600/agent/quarter",
          growth: "1,800/agent/month | 5,400/agent/quarter",
          professional: "2,300/agent/month | 6,900/agent/quarter",
        },
        "Half-Yearly": {
          starter: "1,000/agent/month | 6,000/agent/half-year",
          growth: "1,700/agent/month | 10,200/agent/half-year",
          professional: "2,200/agent/month | 13,200/agent/half-year",
        },
        Annually: {
          starter: "1,000/agent/month | 10,800/agent/year",
          growth: "1,500/agent/month | 18,000/agent/year",
          professional: "2,000/agent/month | 24,000/agent/year",
        },
        Monthly: {
          starter: "NA",
          growth: "2,000/agent/month",
          professional: "2,500/agent/month",
        },
      },
    };

    const planPriceNodes = document.querySelectorAll("[fd-plan-price]");

    planPriceNodes.forEach((node) => {
      const cardName = node.getAttribute("fd-plan-name").toLowerCase().trim(); // either starter, growth or professional

      const priceTextString =
        PRICING_PLAN[currentPlanType][currentTenure][cardName];

      const priceArr = priceTextString.split("|");

      const index = priceArr[0].trim().indexOf("/");

      const mainPrice = priceArr[0].substring(0, index);

      const mainPriceDuration = priceArr[0].substring(index);

      const secondaryPrice = priceArr[1] ? priceArr[1].trim() : "";

      node.querySelector(".price div").innerText = `${
        mainPrice ? mainPrice : "NA"
      }`;

      if (secondaryPrice) {
        node
          .querySelector(".plan_price-duration")
          .querySelector("div").innerText = `${mainPriceDuration}`;
      }

      if (priceTextString === "NA") {
        node.querySelector(".rupee-sign").classList.add("hide");
        node
          .querySelector(".plan_price-duration")
          .querySelector("div").innerText = ``;
      } else {
        node.querySelector(".rupee-sign").classList.remove("hide");
      }

      if (secondaryPrice) {
        node.nextSibling.querySelector("div").innerHTML = `₹${secondaryPrice} `;
      } else {
        node.nextSibling.querySelector("div").innerHTML = "";
      }
    });
  }

  // <span class="billing-duration">(Billed ${currentTenure} )</span>;

  function PlanTypeController() {
    let selectedPlan = "CALL PLAN";

    return {
      set: (newPlan) => {
        selectedPlan = newPlan;
      },
      get: () => selectedPlan,
    };
  }

  function TenureTypeController() {
    let currentTenure = "Annually";
    return {
      set: (newTenure) => {
        currentTenure = newTenure;
      },
      get: () => currentTenure,
    };
  }

  function removeIsActiveClass(el) {
    el.classList.remove("is-active");
  }

  function addIsActiveClass(el) {
    el.classList.add("is-active");
  }

  function addHideClass(el) {
    el.classList.add("hide");
  }
  function removeHideClass(el) {
    el.classList.remove("hide");
  }
});
