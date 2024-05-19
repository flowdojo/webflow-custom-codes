/**
 * Pricing values
 */

let selectedDuration = "yearly";
let isAddonEnabled = true;
let monthly_option = !0;
let lastClickedCard = ''
let lastRecommendedCard = 'free-card';

const additionalSupports = {
  1000000: [
    "Live Chat",
    "Group Onboarding",
    "Weekly Product Training Sessions",
  ],
  5000000: [
    "Live Chat",
    "Email Support from Customer Success Team",
    "Group Onboarding",
    "Weekly Product Training Sessions",
  ],
  10000000: [
    "Live Chat",
    "Email & Phone Support from Dedicated Customer Success Manager",
    "Group Onboarding",
    "Weekly Product Training Sessions",
  ],
  50000000: [
    "Live Chat",
    "Email & Phone Support from Dedicated Customer Success Manager",
    "Strategic Consulting",
    "Implementation Specialist (1:1 Onboarding)",
    "Weekly Product Training Sessions",
  ],
};

const revenue_levels = [
  49999999, 39999999, 29999999, 19999999, 14999999, 9999999, 7499999, 4999999,
  2499999, 999999, 499999, 249999, 0,
];
const prices = {
  "0-250K": {
    monthly: {
      growth: 129,
      pro: 199,
      enterprise: 279,
      creative_cockpit: 79,
    },
    yearly: {
      growth: 1290,
      pro: 1990,
      enterprise: 2790,
      creative_cockpit: 790,
    },
  },
  "250-500K": {
    monthly: {
      growth: 199,
      pro: 299,
      enterprise: 379,
      creative_cockpit: 99,
    },
    yearly: {
      growth: 1990,
      pro: 2990,
      enterprise: 3790,
      creative_cockpit: 990,
    },
  },
  "500-1M": {
    monthly: {
      growth: 299,
      pro: 399,
      enterprise: 499,
      creative_cockpit: 99,
    },
    yearly: {
      growth: 2990,
      pro: 3990,
      enterprise: 4990,
      creative_cockpit: 990,
    },
  },
  "1-2.5M": {
    monthly: {
      growth: 399,
      pro: 499,
      enterprise: 599,
      creative_cockpit: 149,
    },
    yearly: {
      growth: 3990,
      pro: 4990,
      enterprise: 5990,
      creative_cockpit: 1490,
    },
  },
  "2.5-5M": {
    monthly: {
      growth: 599,
      pro: 649,
      enterprise: 799,
      creative_cockpit: 199,
    },
    yearly: {
      growth: 5990,
      pro: 6490,
      enterprise: 7990,
      creative_cockpit: 1990,
    },
  },
  "5-7.5M": {
    monthly: {
      growth: 799,
      pro: 999,
      enterprise: 1149,
      creative_cockpit: 249,
    },
    yearly: {
      growth: 7990,
      pro: 9990,
      enterprise: 11490,
      creative_cockpit: 2490,
    },
  },
  "7.5-10M": {
    monthly: {
      growth: 1149,
      pro: 1299,
      enterprise: 1499,
      creative_cockpit: 299,
    },
    yearly: {
      growth: 11490,
      pro: 12990,
      enterprise: 14990,
      creative_cockpit: 2990,
    },
  },
  "10-15M": {
    monthly: {
      growth: 1499,
      pro: 1699,
      enterprise: 1999,
      creative_cockpit: 399,
    },
    yearly: {
      growth: 14990,
      pro: 16990,
      enterprise: 19990,
      creative_cockpit: 3990,
    },
  },
  "15-20M": {
    monthly: {
      growth: 1799,
      pro: 1999,
      enterprise: 2499,
      creative_cockpit: 499,
    },
    yearly: {
      growth: 17990,
      pro: 19990,
      enterprise: 24990,
      creative_cockpit: 4990,
    },
  },
  "20-30M": {
    monthly: {
      growth: 2199,
      pro: 2499,
      enterprise: 3199,
      creative_cockpit: 599,
    },
    yearly: {
      growth: 21990,
      pro: 24990,
      enterprise: 31990,
      creative_cockpit: 5990,
    },
  },
  "30-40M": {
    monthly: {
      growth: 2799,
      pro: 3199,
      enterprise: 3799,
      creative_cockpit: 699,
    },
    yearly: {
      growth: 27990,
      pro: 31990,
      enterprise: 37990,
      creative_cockpit: 6990,
    },
  },
  "40-50M": {
    monthly: {
      growth: 3499,
      pro: 3799,
      enterprise: 4499,
      creative_cockpit: 799,
    },
    yearly: {
      growth: 34990,
      pro: 37990,
      enterprise: 44990,
      creative_cockpit: 7990,
    },
  },
  "50M+": {
    monthly: {
      growth: "Custom",
      pro: "Custom",
      enterprise: "Custom",
      creative_cockpit: "Custom",
    },
    yearly: {
      growth: "Custom",
      pro: "Custom",
      enterprise: "Custom",
      creative_cockpit: "Custom",
    },
  },
};
const getMonthlyPrices = (range) => {
  const {
    monthly: { growth, pro, enterprise, creative_cockpit },
  } = prices[range];

  return {
    growth,
    pro,
    enterprise,
    creative_cockpit,
  };
};

const getYearlyPrices = (range) => {
  const {
    yearly: { growth, pro, enterprise, creative_cockpit },
  } = prices[range];
  return {
    growth,
    pro,
    enterprise,
    creative_cockpit,
  };
};
/**
 * Global Helper Functions
 */
const getElement = (value) =>
  document.querySelector(`[fd-custom-code="${value}"]`);
const getElements = (value) =>
  document.querySelectorAll(`[fd-custom-code="${value}"]`);

const addCommas = (num) => new Intl.NumberFormat("en-us").format(num);

/**
 * Helper Functions for Card Animations
 */
const hideEnterpriseForm = () => {
  const card = getElement("enterprise-card");
  card.classList.remove("form-visible");
  card.querySelector("[fd-custom-code='card-form']").style.display = "none";
};
const showEnterpriseForm = () => {
  const card = getElement("enterprise-card");
  card.classList.add("form-visible");
  card.querySelector("[fd-custom-code='card-form']").style.display = "block";
};

const decreaseCardSize = (card) => {
  card.classList.add("hide-card");
  card.querySelector(".card-icon-wrap").classList.add("vertical");
  card.querySelector(".card-overview").classList.add("hide");
  card.classList.remove("form-visible");
};

let timeoutId;
let isFirstLoad;
let currentlyShowingCard = "free-card";

const showCard = (card) => {
  card.classList.remove("hide-card");
  card.querySelector(".card-icon-wrap").classList.remove("vertical");
  card.querySelector(".card-overview").classList.remove("hide");

  if (
    isFirstLoad ||
    currentlyShowingCard === card.getAttribute("fd-custom-code")
  ) {
    isFirstLoad = false;
    return;
  }
};

const showCards = (arr) => {
  arr.forEach((el) => {
    const card = getElement(el);
    showCard(card);
  });
};

/**
 * Cards
 */
const freeCard = getElement("free-card");
const growthCard = getElement("growth-card");
const proCard = getElement("pro-card");
const enterpriseCard = getElement("enterprise-card");

const hideAllCards = () => {
 
  [freeCard, growthCard, proCard, enterpriseCard].forEach(decreaseCardSize);
  hideEnterpriseForm();
};
const showAllCards = () => {
  [freeCard, growthCard, proCard].forEach(showCard);
  hideEnterpriseForm();
};

const removeRecommendedClassFromCards = () => {

  [freeCard, growthCard, proCard, enterpriseCard].forEach((card) => {
    card.classList.remove("recommended-card");
  });
};

const removeRecommendedBorderFromCards = () =>
{
    [freeCard, growthCard, proCard, enterpriseCard].forEach((card) => {
      card.classList.remove('recommended-border')
    });
}

const addRecommendedClass = (el) => el.classList.add("recommended-card");
const addRecommendedBorder = (el) => el.classList.add('recommended-border')

/**
 * Logic to set card prices
 */

let priceDuration;
// index refers to the object key that will be selected
let index = 12;

/**
 * Helper functions for All Pricing Logics
 */
const growthPriceNodes = getElements("growth-price");
const proPriceNodes = getElements("pro-price");
const enterprisePriceNodes = getElements("enterprise-price");
const durationNodes = getElements("duration");
const currencyNodes = getElements("currency");

const setPrice = (node, price) => {
  node.innerText = price === "Custom" ? "Custom" : addCommas(price);
  node.setAttribute("price", price);
};

const setAddonCost = (creative_cockpit) => {
  getElement("addon-cost").innerText = `$${creative_cockpit}`;
};
const setPricesToCustom = () => {
  growthPriceNodes.forEach((node) => setPrice(node, "Custom"));
  proPriceNodes.forEach((node) => setPrice(node, "Custom"));
  enterprisePriceNodes.forEach((node) => setPrice(node, "Custom"));
  durationNodes.forEach((node) => (node.innerText = ""));
  currencyNodes.forEach((node) => (node.innerText = ""));

  //   setTotalCost("Custom", false);
  setAddonCost("Custom");
};

const setYearlyPrices = (growth, pro, enterprise, creative_cockpit) => {
  let duration = selectedDuration === "yearly" ? "/year" : "/month";
  growthPriceNodes.forEach((node) => setPrice(node, growth));
  proPriceNodes.forEach((node) => setPrice(node, pro));
  enterprisePriceNodes.forEach((node) => setPrice(node, enterprise));
  durationNodes.forEach((node) => (node.innerText = `${duration}`));
  currencyNodes.forEach((node) => (node.innerText = "$"));

  /** set addon cost */
  setAddonCost(creative_cockpit);

  /** set total cost */
  //   const { selectedTabPrice, isEnterprise } = getSelectedTabPrice();
  //   setTotalCost(selectedTabPrice, isEnterprise);
};

const setMonthlyPrices = (growth, pro, enterprise, creative_cockpit) => {
  let duration = selectedDuration === "yearly" ? "/year" : "/month";
  growthPriceNodes.forEach((node) => setPrice(node, growth));
  proPriceNodes.forEach((node) => setPrice(node, pro));
  enterprisePriceNodes.forEach((node) => setPrice(node, enterprise));
  durationNodes.forEach((node) => (node.innerText = `${duration}`));
  currencyNodes.forEach((node) => (node.innerText = "$"));

  /** set addon cost */
  setAddonCost(creative_cockpit);

  /** set total cost */
  //   const { selectedTabPrice, isEnterprise } = getSelectedTabPrice();
  //   setTotalCost(selectedTabPrice, isEnterprise);
};

const setTotalCost = (price, isEnterprise) => {
  const { creative_cockpit } =
    selectedDuration === "yearly"
      ? pricing_ranges_yearly[index]
      : pricing_ranges_monthly[index];

  let totalCost;
  /**
   * if the selected card is enterprise, we don't add the addon cost
   * also if the isAddonEnabled is false, we don't add the addon cost
   */
  const addonCost = !isAddonEnabled || isEnterprise ? 0 : creative_cockpit;
  if (price !== "Custom") {
    totalCost = addCommas(addonCost + Number(price));
  } else {
    totalCost = "Custom";
    durationNodes.forEach((node) => (node.innerText = ""));
    currencyNodes.forEach((node) => (node.innerText = ""));
  }

  const totalCostNode = document.getElementById("tw-total-cost");
  totalCostNode.innerText = `$${totalCost}`;
};

const getSelectedTabPrice = () => {
  const allPriceTabs = document.querySelectorAll("[fd-card-tab]");
  const selectedTab = [...allPriceTabs].find((el) =>
    el.classList.contains("w--current"),
  );
  //check if selected tab is enterprise
  const isEnterprise = selectedTab.querySelector(
    "[fd-custom-code='enterprise-price']",
  );
  const selectedTabPrice = selectedTab
    .querySelector("[price]")
    .getAttribute("price");

  return {
    selectedTabPrice,
    isEnterprise,
  };
};

const getAdditionalSupportText = (value) => {
  const thresholds = [1000000, 5000000, 10000000, 50000000];
  const defaultThreshold = 50000000;

  const selectedThreshold =
    thresholds.find((threshold) => value < threshold) || defaultThreshold;
  return additionalSupports[selectedThreshold];
};

const setAdditionalSupportText = (supports) => {
  const wrapperNodes = getElements("additional-support");
  wrapperNodes.forEach((node) => {
    node.innerHTML = "";
    supports.forEach((support) => {
      let div = document.createElement("div");
      div.classList.add("card-list-flex");
      div.innerHTML = `
      <img src="https://assets-global.website-files.com/61bcbae3ae2e8ee49aa790b0/651ad7899a658b656c548cd9_647606ad31337d3beb5e2cc5_check-icon-brix-templates.svg.svg"
      loading="lazy" alt=""  class="tick-icon">
      <div>${support}</div>
      `;
      node.appendChild(div);
    });
  });
};

/** helper functions end */
let currentRange = "0-250K";

const setCardsPriceValue = (range = currentRange) => {
  currentRange = range;
  if (range === "50M+") {
    setPricesToCustom();
    return;
  }

  if (selectedDuration === "monthly") {
    const { growth, pro, enterprise, creative_cockpit } =
      getMonthlyPrices(range);
    setMonthlyPrices(growth, pro, enterprise, creative_cockpit);
  } else {
    const { growth, pro, enterprise, creative_cockpit } =
      getYearlyPrices(range);
    setYearlyPrices(growth, pro, enterprise, creative_cockpit);
  }
};

const handleSliderChange = (value) => {
  const ctaOfGrowth = getElement("growth-card").querySelector(".card-demo-btn");
  /**
   * Cards Animiations based on slider value
   */

  removeRecommendedClassFromCards();
  hideEnterpriseForm();
  hideAllCards();
  if (value >= 5000000) {
    // show enterprise and pro for price >= 5 Million
    showCard(getElement("enterprise-card"));
    showCard(getElement("pro-card"));
    //show the form of the enterprise card
    addRecommendedClass(getElement("enterprise-card"));
    addRecommendedBorder(getElement("enterprise-card"))
    lastRecommendedCard = 'enterprise-card'
    showEnterpriseForm();
  } else {
    /** Change CTA of growth card */
    if (value < 500000) {
      // change the button text and link of Growth Card
      ctaOfGrowth.innerText = "Get Started";
      ctaOfGrowth.setAttribute("href", "https://app.triplewhale.com/signup");
    } else if (value < 1000000) {
      // change the button text and link of Growth Card
      ctaOfGrowth.innerText = "Get Started";
      // ctaOfGrowth.setAttribute("href", "https://www.triplewhale.com/bookdemo");
      ctaOfGrowth.setAttribute("href", "https://app.triplewhale.com/signup");
    }
    decreaseCardSize(getElement("enterprise-card"));

    /** 
      Recommended card Logic based on value 
    */
    if (value >= 1000000 && value < 5000000) {
      // add recommended to pro card and show pro and enterprise card
      showEnterpriseForm();
      addRecommendedClass(getElement("pro-card"));
      addRecommendedBorder(getElement('pro-card'))
      lastRecommendedCard = 'pro-card'
      showCard(getElement("pro-card"));
      showCard(getElement("enterprise-card"));
    } else if (value >= 500000 && value < 1000000) {
      // add recommended to growth card & Show growth and pro card
      addRecommendedClass(getElement("growth-card"));
      addRecommendedBorder(getElement('growth-card'))
      lastRecommendedCard = 'growth-card'
      showCard(getElement("growth-card"));
      showCard(getElement("pro-card"));
    } else if (value < 500000) {
      // add recommended to free card & show free and growth card
      addRecommendedClass(getElement("free-card"));
      addRecommendedBorder(getElement('free-card'))
      lastRecommendedCard = 'free-card'
      showCard(getElement("free-card"));
      showCard(getElement("growth-card"));
    }
  }

  /** Setting additional support text */
  const supportTexts = getAdditionalSupportText(value);
  setAdditionalSupportText(supportTexts);
};

const showDropdown = () => {
  getElement("pricing-dropdowns").style.display = "block";
  getElement("selected-price-wrapper").classList.add("is-open");
};
const closeDropdown = () => {
  console.log("closing");
  getElement("pricing-dropdowns").style.display = "none";
  getElement("selected-price-wrapper").classList.remove("is-open");
};

const arrayMatch = (arr1, arr2) => arr1.some((item) => arr2.includes(item));

/**
 * Main Starter Functions
 */

let isOpen = false;

const handleBodyClick = (e) => {
  const classes = [...e.target.classList];

  const targetClasses = [
    "selected-price-wrapper",
    "pricing-dropdowns",
    "pricing-dropdown-item",
    "selected-price-range",
    "pricing-dropdown-arrow",
  ];
  if (arrayMatch(classes, targetClasses)) return;
  isOpen = false;
  closeDropdown();
};

const initSliderAnimation = () => {
  getElement("pricing-dropdown-container").addEventListener("click", () => {
    if (!isOpen) {
      showDropdown();
      // add event listener on body to close the dropdown on clicking anywhere else
      document.querySelector("body").addEventListener("click", handleBodyClick);
    } else {
      closeDropdown();
      document
        .querySelector("body")
        .removeEventListener("click", handleBodyClick);
    }
    isOpen = !isOpen;
  });
  /** add click listeners on each of the options */
  const allOptions = document.querySelectorAll(".pricing-dropdown-item");
  allOptions.forEach((option) => {
    option.addEventListener("click", () => {
        lastClickedCard = ''
        removeRecommendedBorderFromCards()
        isOpen = true;
        // change selected price text
        const priceVal = Number(option.getAttribute("fd-pricing-value")) - 1;
        const range = option.getAttribute("fd-custom-range");
        getElement("selected-price").innerText = `${option.innerText}`;
        getElement("selected-price-wrapper").classList.remove("is-open");
        // toggle the dropdown
        handleSliderChange(priceVal);
        setCardsPriceValue(range);

        getElement("pricing-dropdowns").style.display = "none";
    });
  });
};



const addListenerToCards = () => {
  const allCards = document.querySelectorAll("[fd-pricing-card]");
  allCards.forEach((card) => {
    card.addEventListener("click", () => {
        const selectedCard = card.getAttribute("fd-custom-code");
        
        if (selectedCard === lastClickedCard) return
        removeRecommendedClassFromCards()
        removeRecommendedBorderFromCards()
        addRecommendedBorder(card)
        // fire click listener only if it is hidden
        if (card.classList.contains("hide-card")) {
            // show enterprise form if the selcted card is enteprise
            hideAllCards();

            if (selectedCard === "enterprise-card" || selectedCard === "pro-card") {
                showCard(getElement("pro-card"));
                showCard(getElement("enterprise-card"));
                showEnterpriseForm();
            } else {
                hideEnterpriseForm();
            if (selectedCard === "free-card")
                showCards(["free-card", "growth-card"]);
            if (selectedCard === "growth-card")
                showCards(["growth-card", "pro-card"]);
            }
        }
        if (selectedCard === lastRecommendedCard) {
            addRecommendedClass(getElement(selectedCard))
        }
        lastClickedCard = selectedCard;

        allCards.forEach((item) => {
            const cardIconWrap = item.querySelector(".card-icon-wrap");
            if (cardIconWrap.classList.contains("vertical")) {
                cardIconWrap.style.top = `0px`;
            }
        });
    });
  });
};

const addToggleListener = () => {
  const toggler = getElement("duration-toggle");

  toggler.addEventListener("click", () => {
    selectedDuration = selectedDuration === "yearly" ? "monthly" : "yearly";

    setCardsPriceValue();

    // logic for setting total cost
    // const { selectedTabPrice, isEnterprise } = getSelectedTabPrice();

    // setTotalCost(selectedTabPrice, isEnterprise);
  });
};

const addAddonClickListener = () => {
  let isOn = true;
  const addOnToggle = document.getElementById("tw-toggle-add-on-cc");
  const thumb = addOnToggle.querySelector(".toggle-thumb");
  thumb.style.transition = "transform 0.3s ease";

  addOnToggle.addEventListener("click", () => {
    // if already on, we change the color to grey else we change back to green
    const bgColor = isOn ? "rgb(182, 185, 206)" : "rgb(14, 188, 110)";
    const transformValue = isOn ? "translateX(-100%)" : "translateX(0)";
    addOnToggle.style.backgroundColor = bgColor;
    thumb.style.transform = transformValue;

    isOn = !isOn;
    isAddonEnabled = isOn;

    // const { selectedTabPrice, isEnterprise } = getSelectedTabPrice();
    // setTotalCost(selectedTabPrice, isEnterprise);
  });
};

const addTabClickListener = () => {
  const tabs = document.querySelectorAll(
    ".price-box-tall.w-inline-block.w-tab-link",
  );
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const price = tab.querySelector("[price]").getAttribute("price");
      //check if tab is enterprise
      const isEnterprise = tab.querySelector(
        "[fd-custom-code='enterprise-price']",
      );

      //   setTotalCost(price, isEnterprise);
    });
  });
};

/**
 * Scroll Event
 */
const handleScroll = () => {
  const stickyCards = document.querySelectorAll(".pricing-card");
  stickyCards.forEach((card) => {
    // if (card.classList.contains("hide-card")) return;

    const navBar = document.querySelector(".new-navbar-2022");
    const navHeight = navBar.clientHeight;

    const cardPaddingTop = window.getComputedStyle(
      card.querySelector(".card-content-wrap"),
    ).paddingTop;

    const cardPaddingTopValue = Number(cardPaddingTop.replace("px", ""));
    const cardPos = card.offsetTop + cardPaddingTopValue;

    if (window.scrollY - cardPos >= 0)
      card.querySelector(".card-icon-wrap").classList.add("is-sticky");
    else card.querySelector(".card-icon-wrap").classList.remove("is-sticky");

    const cardIconWrap = card.querySelector(".card-icon-wrap");

    const windowWidth = window.innerWidth;
    if (windowWidth < 992) {
      cardIconWrap.style.top = `${navHeight}px`;
      return;
    }
    if (cardIconWrap.classList.contains("vertical")) {
      cardIconWrap.style.top = `0px`;
    } else {
      cardIconWrap.style.top = `${navHeight}px`;
    }
  });
};

/**
 * Function Calls
 */

initSliderAnimation();
addListenerToCards();

addToggleListener();

setCardsPriceValue(currentRange);

addAddonClickListener();

addTabClickListener();
