document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".career-apply-form");

  const inputs = form.querySelectorAll("input:not([type='submit'])"); // Exclude submit button
  const textArea = form.querySelector("textarea");

  const emailInput = form.querySelector("input[type='email']");
  const telInput = form.querySelector("input[type='tel']");

  const telephoneErrorNode = form.querySelector(
    "[fd-code='error-state-phone']"
  );
  const emailErrorNode = form.querySelector("[fd-code='error-state-email']");

  hide(telephoneErrorNode);
  hide(emailErrorNode);

  disableSubmitButton();

  addInputFocusInteraction();

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

  function addInputFocusInteraction() {
    const inputs = form.querySelectorAll("input:not([type='submit'])");
    const textAreas = form.querySelectorAll("textarea");

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
  }

  function enableSubmitButton() {
    const submitBtn = form.querySelector("[fd-code='submit-btn']");
    const siblingText =
      submitBtn.parentElement.querySelector(".form-submit-text");
    submitBtn.style.pointerEvents = "auto";
    submitBtn.disabled = false;

    siblingText.style.pointerEvents = "auto";
    siblingText.disabled = false;

    siblingText.classList.add("white-outline"); // Add the 'is-fill' class
  }

  function disableSubmitButton() {
    const submitBtn = form.querySelector("[fd-code='submit-btn']");
    const siblingText =
      submitBtn.parentElement.querySelector(".form-submit-text");
    submitBtn.style.pointerEvents = "none";
    submitBtn.disabled = true;

    siblingText.style.pointerEvents = "none";
    siblingText.disabled = true;

    siblingText.classList.remove("white-outline"); // Add the 'is-fill' class
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

  function validateEmail(email) {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateTel(tel) {
    // Regular expression to allow an optional "+" at the beginning, followed by digits
    return /^\+?[0-9]+$/.test(tel);
  }
});
