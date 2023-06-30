const getElem = (attributeValue) =>
  document.querySelector(`[fd-custom-code='${attributeValue}']`);

const init = () => {
  const evaluatePercentage = (num) => num / 100;
  const formatToUS = (num) => new Intl.NumberFormat("en-US").format(num);

  const updateUI = (additionalMonthlyRevenue, estimatedReturns) => {
    const monthlyRevenueNode = getElem("additional-monthly-revenue");
    const roiValueNode = getElem("roi-value");

    monthlyRevenueNode.innerHTML = formatToUS(
      Number(additionalMonthlyRevenue).toFixed(0)
    );
    roiValueNode.innerHTML = Number(estimatedReturns).toFixed(2);
  };
  const sliders = {
    activeUsers: {
      node: getElem("active-users"),
      value: 10000
    },
    lifetime: {
      node: getElem("lifetime-value"),
      value: 10
    },
    retention: {
      node: getElem("increase-retention"),
      value: 5
    }
  };

  const calculateData = () => {
    const cost = (sliders.activeUsers.value / 10000) * 40;
    const baseRetention = 30;
    const lifeTimeWithApp = 3;
    const { activeUsers, lifetime, retention } = sliders;
    const { value: activeUsersValue } = activeUsers;
    const { value: lifetimeValue } = lifetime;
    const { value: retentionValue } = retention;

    const additionalMonthlyRevenue =
      (evaluatePercentage(baseRetention) *
        evaluatePercentage(retentionValue) *
        activeUsersValue *
        lifetimeValue) /
      12 /
      lifeTimeWithApp;

    const estimatedReturns =
      additionalMonthlyRevenue / ((cost / 1000000) * activeUsersValue);

    return {
      additionalMonthlyRevenue,
      estimatedReturns
    };
  };

  const updateSliders = (slider, value) => {
    slider.value = value;
  };

  for (const slider of Object.values(sliders)) {
    slider.node.addEventListener("input", (e) => {
      const value = Number(e.target.value);
      updateSliders(slider, value);
      const { additionalMonthlyRevenue, estimatedReturns } = calculateData();
      updateUI(additionalMonthlyRevenue, estimatedReturns);
    });
  }
};

window.addEventListener("DOMContentLoaded", init);
