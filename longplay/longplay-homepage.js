const init = () => {
  const selectNode = document.querySelector(
    "[fd-custom-code='solutions-select']"
  );
  const allCards = document.querySelectorAll(
    "[fd-custom-code='solutions-block']"
  );

  const hide = (el) => (el.style.display = "none");
  const showFlex = (el) => (el.style.display = "flex");

  const getActiveCard = (cards, value) =>
    cards.find(
      (card) => Number(card.getAttribute("fd-solution-block")) === Number(value)
    );

  selectNode.addEventListener("change", (e) => {
    const value = e.target.value;

    allCards.forEach(hide);

    const cardToShow = getActiveCard([...allCards], value);

    showFlex(cardToShow);
  });
};

init();
