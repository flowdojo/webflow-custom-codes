const init = () => {
  const slider = document.querySelector(
    "[fd-custom-code='range-input-slider']"
  );

  const planCards = document.querySelectorAll("[fd-custom-code='plan-card']");

  const hide = (el) => (el.style.display = "none");
  const showGrid = (el) => (el.style.display = "grid");

  const getActiveCard = (cards, value) => {
    return cards.find((card) => {
      const cardValue = Number(card.getAttribute("fd-plan-card"));
      return cardValue === Number(value);
    });
  };
  slider.addEventListener("input", (e) => {
    const value = e.target.value;

    // hide all cards
    planCards.forEach(hide);

    const cardToShow = getActiveCard([...planCards], value);
    showGrid(cardToShow);
  });
};

init();
