"use strict";

window.Webflow ||= [];
window.Webflow.push(() => {
  const questionBoxes = getElements("question-box");

  if (questionBoxes && questionBoxes.length > 0) {
    questionBoxes.forEach(addChangeListenerToQuestionInputs);
  }

  function addChangeListenerToQuestionInputs(questionBox) {
    const radioInputs = [
      ...questionBox.querySelectorAll("input[type='radio']"),
    ];

    const incorrectAnswerNode = getElement(
      "incorrect-answer-wrap",
      questionBox.pqrentNode
    );

    const correctAnswerNode = getElement(
      "correct-answer-wrap",
      questionBox.parentNode
    );

    radioInputs.forEach((input, index) => {
      input.addEventListener("change", function (e) {
        const { isCorrect, correctOptionNumber } =
          verifyIfChosenAnswerIsCorrect(questionBox, index + 1);

        const correctAnswerText = radioInputs[
          correctOptionNumber - 1
        ].parentNode
          .querySelector("span")
          .innerText.trim();

        getElement("correct-answer", questionBox.parentNode).innerText =
          correctAnswerText;

        if (isCorrect) {
          removeHideClass(correctAnswerNode);
          addHideClass(incorrectAnswerNode);
          // highlight correct answer success div
        } else {
          addHideClass(correctAnswerNode);
          removeHideClass(incorrectAnswerNode);
        }
      });
    });
  }

  function verifyIfChosenAnswerIsCorrect(questionBox, chosenAnswerIndex) {
    const correctOptionText = getElement(
      "correct-option",
      questionBox
    ).innerText.trim();

    const correctOptionNumber = correctOptionText.split(" ")[1];

    return {
      isCorrect: chosenAnswerIndex.toString() === correctOptionNumber,
      correctOptionNumber,
    };
  }

  function getElement(value, wrapper = document) {
    return wrapper.querySelector(`[fd-code='${value}']`);
  }
  function getElements(value) {
    return document.querySelectorAll(`[fd-code='${value}']`);
  }

  function addHideClass(el) {
    el.classList.add("hide");
  }
  function removeHideClass(el) {
    el.classList.remove("hide");
  }
});
