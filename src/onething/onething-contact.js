document.addEventListener("DOMContentLoaded", () => {
  const ctaForms = document.querySelectorAll(".cta-section-2 form");

  addInputFocusInteraction();

  if (ctaForms.length) {
    ctaForms.forEach((ctaForm) => {
      const inputs = ctaForm.querySelectorAll("input:not([type='submit'])"); // Exclude submit button
      const textArea = ctaForm.querySelector("textarea");

      const emailInput = ctaForm.querySelector("input[type='email']");
      const telInput = ctaForm.querySelector("input[type='tel']");

      const telephoneErrorNode = ctaForm.querySelector(
        "[fd-code='error-state-phone']"
      );
      const emailErrorNode = ctaForm.querySelector(
        "[fd-code='error-state-email']"
      );

      hide(telephoneErrorNode);
      hide(emailErrorNode);

      disableSubmitButton();

      let timeoutId;

      emailInput.addEventListener("input", () => {
        clearTimeout(timeoutId);

        if (!emailInput.value) {
          hide(emailErrorNode);
          removeMarginTop(emailErrorNode.parentNode.nextSibling);
          return;
        }
        timeoutId = setTimeout(() => {
          const isEmailValid = validateEmail(emailInput.value);
          if (!isEmailValid) {
            emailErrorNode.querySelector("div:last-child").innerText =
              "Please Enter a Valid Email";
            showError(emailErrorNode);

            addMarginTop(emailErrorNode.parentNode.nextSibling);
            // add margin to the field below this input node
          } else {
            hide(emailErrorNode);
            removeMarginTop(emailErrorNode.parentNode.nextSibling);
          }
        }, 500);
      });

      telInput.addEventListener("input", () => {
        clearTimeout(timeoutId);

        if (!telInput.value) {
          hide(telephoneErrorNode);
          removeMarginTop(telephoneErrorNode.parentNode.nextSibling);
          return;
        }
        timeoutId = setTimeout(() => {
          const isTelValid = validateTel(telInput.value);

          if (!isTelValid) {
            telephoneErrorNode.querySelector("div:last-child").innerText =
              "Please Enter a Valid Phone Number";
            showError(telephoneErrorNode);
            addMarginTop(telephoneErrorNode.parentNode.nextSibling);
          } else {
            hide(telephoneErrorNode);
            removeMarginTop(telephoneErrorNode.parentNode.nextSibling);
          }
        }, 500);
      });

      inputs.forEach((input) => {
        input.addEventListener("input", handleInput);
      });

      textArea.addEventListener("input", handleInput);

      function handleInput() {
        // Check if all inputs have a value
        const isAllInputsFilled = [...inputs].every(
          (inp) => inp.value.trim() !== ""
        );
        const isTextAreaFilled = textArea.value.trim() !== ""; // Ensure no extra spaces are considered
        // Validate email and telephone fields
        const isEmailValid = validateEmail(emailInput.value);
        const isTelValid = validateTel(telInput.value);

        if (!isTelValid || !isEmailValid) {
          disableSubmitButton();
          return;
        }

        if (isAllInputsFilled && isTextAreaFilled) {
          enableSubmitButton();
        } else {
          disableSubmitButton();
        }
      }

      function enableSubmitButton() {
        const submitBtn = ctaForm.querySelector("[fd-code='submit-btn']");
        const siblingText =
          submitBtn.parentElement.querySelector(".form-submit-text");
        submitBtn.style.pointerEvents = "auto";
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;
        //siblingText.style.backgroundColor = "#0a0a0a";

        siblingText.style.pointerEvents = "auto";
        siblingText.disabled = false;
        siblingText.style.opacity = 1;
        console.log("Button Enabled");
        siblingText.classList.add("is-fill"); // Add the 'is-fill' class
      }

      function disableSubmitButton() {
        const submitBtn = ctaForm.querySelector("[fd-code='submit-btn']");
        const siblingText =
          submitBtn.parentElement.querySelector(".form-submit-text");
        submitBtn.style.pointerEvents = "none";
        submitBtn.disabled = true;
        submitBtn.style.opacity = 0.5;

        siblingText.style.pointerEvents = "none";
        siblingText.disabled = true;
        siblingText.style.opacity = 0.5;
        siblingText.classList.remove("is-fill"); // Add the 'is-fill' class
      }

      stopShiftOnSubmission();
      let intervalId;
      let count = 0;

      function stopShiftOnSubmission() {
        // ctaForm.submit(function () {
        //   // custom submissino logic
        //   const scrollPosition = window.scrollY;
        //   // disableScrolling(top);
        //   // After submission, reset scroll position (delay if necessary)
        //   intervalId = setInterval(function () {
        //     console.log("Scrolling");
        //     window.scrollTo(0, scrollPosition);
        //     count++;
        //     if (count > 100) {
        //       clearTimeout(intervalId);
        //       return;
        //     }
        //   }, 20);
        //   return true;
        // });
        const threshold = window.innerWidth > 767 ? 100 : 120;
        ctaForm
          .querySelector("[fd-code='submit-btn']")
          .addEventListener("click", function () {
            // custom submissino logic
            const scrollPosition = window.scrollY;
            // disableScrolling(top);
            // After submission, reset scroll position (delay if necessary)
            intervalId = setInterval(function () {
              console.log("Scrolling");
              window.scrollTo(0, scrollPosition);
              count++;
              if (count > threshold) {
                clearTimeout(intervalId);
                return;
              }
            }, 20);
            return true;
          });
      }
    });
  }

  function validateEmail(email) {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateTel(tel) {
    // Regular expression to allow an optional "+" at the beginning, followed by digits
    return /^\+?[0-9]+$/.test(tel);
  }

  function displayValidationMessage(inputElement, isValid, message) {
    return alert(message);
    const errorPara = inputElement.nextElementSibling.querySelector(
      ".validation-error-para"
    );

    if (!isValid) {
      errorPara.textContent = message;
      errorPara.style.display = "block";
    } else {
      errorPara.style.display = "none";
    }
  }

  function addInputFocusInteraction() {
    const ctaForms = document.querySelectorAll(".cta-section-2");

    if (ctaForms.length) {
      ctaForms.forEach((ctaForm) => {
        const inputs = ctaForm.querySelectorAll("input:not([type='submit'])");
        const textAreas = ctaForm.querySelectorAll("textarea");

        const elements = [...inputs, ...textAreas];

        let focusTimeoutId;
        let blurTimeoutId;

        elements.forEach((input) => {
          const textField = input.nextSibling;
          input.addEventListener("focus", () => {
            clearTimeout(focusTimeoutId);

            focusTimeoutId = setTimeout(() => {
              textField.classList.add("move-up");
            }, 0);
          });

          input.addEventListener("input", () => {
            if (input.value !== "") {
              clearTimeout(focusTimeoutId);

              focusTimeoutId = setTimeout(() => {
                textField.classList.add("move-up");
              }, 0);
            }
          });

          input.addEventListener("blur", () => {
            clearTimeout(blurTimeoutId);

            blurTimeoutId = setTimeout(() => {
              if (input.value === "") {
                textField.classList.remove("move-up");
              } else {
                input;
              }
            }, 0);
          });
        });
      });
    }
  }

  function hide(el) {
    el.style.display = "none";
  }

  function showError(el) {
    el.style.display = "flex";
  }

  function addMarginTop(el) {
    el.style.marginTop = "68px";
  }

  function removeMarginTop(el) {
    el.style.marginTop = "0px";
  }
});
