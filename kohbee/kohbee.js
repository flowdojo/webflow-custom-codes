const yearlyWhatsapp = {
  starter: document.querySelector("[pd-yearly-whatsapp='starter']"),
  premium: document.querySelector("[pd-yearly-whatsapp='premium']"),
  mogul: document.querySelector("[pd-yearly-whatsapp='mogul']")
};

const monthlyWhatsapp = {
  starter: document.querySelector("[pd-monthly-whatsapp='starter']"),
  premium: document.querySelector("[pd-monthly-whatsapp='premium']"),
  mogul: document.querySelector("[pd-monthly-whatsapp='mogul']")
};

const yearlyPricing = {
  starter: document.querySelector("[pd-price-yearly='starter']"),
  premium: document.querySelector("[pd-price-yearly='premium']"),
  mogul: document.querySelector("[pd-price-yearly='mogul']")
};

const monthlyPricing = {
  starter: document.querySelector("[pd-price-monthy='starter']"),
  premium: document.querySelector("[pd-price-monthy='premium']"),
  mogul: document.querySelector("[pd-price-monthy='mogul']")
};

// helper functions start
const divideBy12 = (num) => Math.round(num / 12);
const addComas = (num) =>
  Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(num);

// const addComasUS = (num) =>
//   Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(num);

// helper function ends
let USER_LOCATION = "US";

const divideBy12AndAddComas = (num) => addComas(divideBy12(num));

// if (COUNTRY === "IN") {
//   divideBy12AndAddComas = (num) => addComas(divideBy12(num));
// } else {
//   divideBy12AndAddComas = (num) => addComasUS(divideBy12(num));
// }

const prices = {
  IN: {
    yearly: {
      starter: `₹2,099`,
      premium: `₹2,399`,
      mogul: `₹7,999`
    },
    monthly: {
      starter: `₹${divideBy12AndAddComas(36000)}`,
      premium: `₹${divideBy12AndAddComas(43000)}`,
      mogul: `₹${divideBy12AndAddComas(146000)}`
    },
    whatsapp: {
      starter: 500,
      premium: 2000,
      mogul: 5000,
      additionalWhatsapp: "₹775 for 1000"
    },
    email: {
      additionalEmail: "₹800 for 10000"
    }
  },
  UK: {
    yearly: {
      starter: "£33",
      premium: "£47",
      mogul: "£239"
    },
    monthly: {
      starter: "£49",
      premium: "£71",
      mogul: "£359"
    },
    whatsapp: {
      starter: 250,
      premium: 1000,
      mogul: 2500,
      additionalWhatsapp: "£96.16 for 1000"
    },
    email: {
      additionalEmail: "£9 for 10000"
    }
  },
  AU: {
    yearly: {
      starter: "$61",
      premium: "$88",
      mogul: "$446"
    },
    monthly: {
      starter: "$92",
      premium: "$132",
      mogul: "$668"
    },
    whatsapp: {
      starter: 500,
      premium: 2000,
      mogul: 5000,
      additionalWhatsapp: "AUS$136.2 per 1000"
    },
    email: {
      additionalEmail: "AUS$15 per 10000"
    }
  },
  US: {
    yearly: {
      starter: "$129",
      premium: "$199",
      mogul: "$349"
    },
    monthly: {
      starter: "$194",
      premium: "$299",
      mogul: "$524"
    },
    whatsapp: {
      starter: 250,
      premium: 1000,
      mogul: 2500,
      additionalWhatsapp: "$129.45 per 1000"
    },
    email: {
      additionalEmail: "$10 per 10000"
    }
  }
};

const setPrices = async () => {
  await fetchUserLocation(); // modifies the USER_LOCATION variable
  // if user is from India, we hide the Toggle Tab, the disount image &
  if (USER_LOCATION === "IN") {
    const nodesToHide = document.querySelectorAll(
      "[fd-custom-code='hide-for-india']"
    );
    nodesToHide.forEach((el) => (el.style.display = "none"));
  } else {
    const nodesToHide = document.querySelectorAll(
      "[fd-custom-code='hide-for-india']"
    );
    nodesToHide.forEach((el) => (el.style.display = "flex"));
  }
  const price = prices[USER_LOCATION];

  // ÷=const price = prices["US"];

  // initially we set the yearly prices
  // setMonthlyPrice(price)
  setYearlyPrice(price);
  setStrikePrice(price);
  setWhatsappNum(price);
  setExtraEmailPrice(price);

  const tabs = document.querySelectorAll(".pricing-2-tabs-menu a");
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const currentlySelected = tab.querySelector("div").innerHTML;
      if (currentlySelected === "Monthly") {
        setMonthlyPrice(price);
        // do monthly changes here
      } else {
        // do yearly changes here
        setYearlyPrice(price);
        setStrikePrice(price);
      }
    });
  });
};

setPrices();

function setMonthlyPrice(price) {
  monthlyPricing.starter.innerHTML = price.monthly.starter;
  monthlyPricing.premium.innerHTML = price.monthly.premium;
  monthlyPricing.mogul.innerHTML = price.monthly.mogul;
}

function setYearlyPrice(price) {
  yearlyPricing.starter.innerHTML = price.yearly.starter;
  yearlyPricing.premium.innerHTML = price.yearly.premium;
  yearlyPricing.mogul.innerHTML = price.yearly.mogul;
}

function setStrikePrice(price) {
  const strikeStarter = document.querySelector("[pd-custom-strike='starter']");
  const strikePremium = document.querySelector("[pd-custom-strike='premium']");
  const strikeMogul = document.querySelector("[pd-custom-strike='mogul']");

  strikeStarter.innerHTML = price.monthly.starter;
  strikePremium.innerHTML = price.monthly.premium;
  strikeMogul.innerHTML = price.monthly.mogul;
}

function setWhatsappNum(price) {
  document.querySelectorAll("[pd-yearly-whatsapp='starter']").forEach((el) => {
    el.innerHTML = price.whatsapp.starter;
  });
  document.querySelectorAll("[pd-monthly-whatsapp='starter']").forEach((el) => {
    el.innerHTML = price.whatsapp.starter;
  });
  document.querySelectorAll("[pd-yearly-whatsapp='premium']").forEach((el) => {
    el.innerHTML = price.whatsapp.premium;
  });
  document.querySelectorAll("[pd-monthly-whatsapp='premium']").forEach((el) => {
    el.innerHTML = price.whatsapp.premium;
  });
  document.querySelectorAll("[pd-yearly-whatsapp='mogul']").forEach((el) => {
    el.innerHTML = price.whatsapp.mogul;
  });
  document.querySelectorAll("[pd-monthly-whatsapp='mogul']").forEach((el) => {
    el.innerHTML = price.whatsapp.mogul;
  });

  // tooltip prices

  document.querySelectorAll("[fd-tooltip-pricing='starter']").forEach((el) => {
    el.innerHTML = price.whatsapp.additionalWhatsapp;
  });
  document.querySelectorAll("[fd-tooltip-pricing='premium']").forEach((el) => {
    el.innerHTML = price.whatsapp.additionalWhatsapp;
  });
  document.querySelectorAll("[fd-tooltip-pricing='mogul']").forEach((el) => {
    el.innerHTML = price.whatsapp.additionalWhatsapp;
  });
}

function setExtraEmailPrice(price) {
  document
    .querySelectorAll("[fd-tooltip-email-pricing='starter']")
    .forEach((el) => {
      el.innerHTML = price.email.additionalEmail;
    });
}

async function fetchUserLocation() {
  try {
    const resp = await fetch("https://ipapi.co/json/");
    const data = await resp.json();
    console.log("user location is", data);
    USER_LOCATION = data.country;
  } catch (error) {
    console.error("ERRRRR", error.message);
    USER_LOCATION = "US";
  } finally {
    if (USER_LOCATION !== "IN") {
      let els = document.querySelectorAll("[fd-custom-code='show-in-india']");
      els.forEach((el) => (el.style.display = "none"));
    }

    let el1 = document.querySelector("[fd-custom-code='show-before-loading']");
    if (el1) {
      el1.style.display = "none";
    }

    let el2 = document.querySelector("[fd-custom-code='show-after-loading']");

    if (el2) {
      el2.style.display = "block";
    }

    if (
      USER_LOCATION !== "US" &&
      USER_LOCATION !== "UK" &&
      USER_LOCATION !== "IN" &&
      USER_LOCATION !== "AU"
    ) {
      USER_LOCATION = "US";
    }
  }
}
