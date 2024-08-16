"use strict";

window.Webflow ||= [];
window.Webflow.push(() => {
  // render quizz

  const quizMarkups = document.querySelectorAll("[fd-code='quiz-embed']");

  const div = document.createElement("div");

  quizMarkups.forEach((quiz, index) => {
    const options = ["option-one", "option-two", "option-three", "option-four"];

    const [optionOne, optionTwo, optionThree, optionFour] = options.map(
      (option) => quiz.getAttribute(option)
    );

    const question = quiz.getAttribute("question");

    const answer = quiz.getAttribute("answer");

    div.innerHTML += `<form style="margin-bottom : 24px" data-name="Email Form" method="get" data-wf-page-id="66ab0ff6fed68425ddb2c598" data-wf-element-id="f7f9df9f-691c-eb61-0030-a3f96b1baeca" localized="" aria-label="Email Form" dir="ltr">
      <div fd-code="question-box" class="question-box" localized="" dir="ltr">
        <h2 class="heading-style-h4 is-medium" i18next-orgval-0="${question}" localized="" dir="ltr">
          ${index + 1}. ${question}
        </h2>
        <div class="spacer-24" localized="" dir="ltr"></div>
        <div class="options-wrap" localized="" dir="ltr">
          <label class="math-ans-wrap w-radio" localized="" dir="ltr">
            <input
              type="radio" data-name="Radio" id="radio" name="radio" class="w-form-formradioinput option-radio w-radio-input" value="Radio" value-i18next-orgval="Radio" localized="" dir="ltr"
            />
            <span class="option-text w-form-label" for="radio" i18next-orgval-0="${optionOne}" localized="" dir="ltr">${optionOne}</span>
          </label>
          <label class="math-ans-wrap w-radio" localized="" dir="ltr">
            <input type="radio" data-name="Radio 2" id="radio-2" name="radio" class="w-form-formradioinput option-radio w-radio-input" value="Radio" value-i18next-orgval="Radio" localized="" dir="ltr"/>
            <span class="option-text w-form-label" for="radio-2" i18next-orgval-0="${optionTwo}" localized="" dir="ltr" >${optionTwo}</span>
          </label>
            <label class="math-ans-wrap w-radio" localized="" dir="ltr"><input type="radio" data-name="Radio 2" id="radio-2" name="radio" class="w-form-formradioinput option-radio w-radio-input" value="Radio" value-i18next-orgval="Radio" localized="" dir="ltr"/>
            <span class="option-text w-form-label" for="radio-2" i18next-orgval-0="${optionThree}" localized="" dir="ltr" >${optionThree}</span>
          </label>
          <label class="math-ans-wrap w-radio" localized="" dir="ltr">
            <input type="radio" data-name="Radio 2" id="radio-2" name="radio" class="w-form-formradioinput option-radio w-radio-input" value="Radio" value-i18next-orgval="Radio" localized="" dir="ltr"/>
            <span class="option-text w-form-label" for="radio-2" i18next-orgval-0="${optionFour}" localized="" dir="ltr" >${optionFour}</span>
          </label>
        </div>
        <div fd-code="correct-option" class="correct-option" i18next-orgval-0="Option 2" localized="" dir="ltr">
          ${answer}
        </div>
      </div>

      <div
        fd-code="correct-answer-wrap"
        class="correct-answer-wrap"
        localized=""
        dir="ltr"
      >
        <div
          class="correct-answer-text"
          i18next-orgval-0="Correct"
          localized=""
          dir="ltr"
        >
          Correct
        </div>
      </div>
      <div
        fd-code="incorrect-answer-wrap"
        class="incorrect-answer-wrap hide"
        localized=""
        dir="ltr"
      >
        <div
          class="incorrect-answer-text"
          i18next-orgval-0="Incorrect"
          localized=""
          dir="ltr"
        >
          Incorrect
        </div>
        <div class="incorrect-answer-para" localized="" dir="ltr">
          <span
            class="text-semibold"
            i18next-orgval-0="correct answer Is: "
            localized=""
            dir="ltr"
            >correct answer Is: </span
          ><span
            fd-code="correct-answer"
            i18next-orgval-0="Height"
            localized=""
            dir="ltr"
            >${answer}</span
          ><br localized="" dir="ltr" />
        </div>
      </div>
    </form>`;
  });

  console.log({ quizMarkups });
  document
    .querySelectorAll("[fd-code='quiz-content']")
    .forEach((wrapperNode) => {
      wrapperNode.innerHTML = div.innerHTML;
    });

  // hide all the correct and incorrect option higlight nodes

  document
    .querySelectorAll("[fd-code='correct-answer-wrap']")
    .forEach(addHideClass);
  document
    .querySelectorAll("[fd-code='incorrect-answer-wrap']")
    .forEach(addHideClass);

  // add click listeners

  const quizzes = document.querySelectorAll("[fd-code='question-box']");

  quizzes.forEach((quiz) => {
    const radioInputs = quiz.querySelectorAll("input[type='radio']");

    const formNode = quiz.parentNode;

    radioInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const correctAnswer = quiz
          .querySelector("[fd-code='correct-option']")
          .innerText.trim();

        const chosenAnswer = e.currentTarget.parentNode
          .querySelector("span")
          .innerText.trim();

        if (chosenAnswer === correctAnswer) {
          // show the correct answer dialog
          removeHideClass(
            formNode.querySelector("[fd-code='correct-answer-wrap']")
          );
          addHideClass(
            formNode.querySelector("[fd-code='incorrect-answer-wrap']")
          );
        } else {
          // show incorrect answer dialog
          addHideClass(
            formNode.querySelector("[fd-code='correct-answer-wrap']")
          );
          removeHideClass(
            formNode.querySelector("[fd-code='incorrect-answer-wrap']")
          );
        }
      });
    });
  });

  function removeHideClass(el) {
    el.classList.remove("hide");
  }

  function addHideClass(el) {
    el.classList.add("hide");
  }
});
