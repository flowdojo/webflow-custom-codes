
function getOrSetUUIDLocalStorage() {
  const localStorageKey = "toplyne-chatbot-anonymous-id";
  let uuid = localStorage.getItem(localStorageKey);
  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem(localStorageKey, uuid);
  }
  return uuid;
}

function getOrSetUUIDSessionStorage() {
  const sessionStorageKey = "toplyne-chatbot-session-id";
  let uuid = sessionStorage.getItem(sessionStorageKey);
  if (!uuid) {
    uuid = generateUUID();
    sessionStorage.setItem(sessionStorageKey, uuid);
  }
  return uuid;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let gsapJumpingAnim;

const botMovementControl = createBotIconMovement();
const counter = counterController();
const allQuestionsWrapper = document.querySelector(".all-questions-wrapper");
const mainChatWrapper = document.querySelector(".main-chat");
const reverseController = shouldReverseController();

let isChatScreenVisible; // for the herosection chat screen

/** API request controller */
let controller = null;

const init = async () => {
  // set first question as active initially
  // setActiveClass([...allQuestionsWrapper.querySelectorAll(".question-box")][0])
  botMovementControl.start(); // To start the movement
  handleResize();
  handleMouseMovement();
  questionClickListener();
  addChatInputListener();
  addInputFocusListener();

  await makeAPIRequest("nothing", "launch");

  /**
   * load previous chats from session storage
   */

  // loadChatsFromSessionStorage()
};

init();

function questionClickListener() {
  const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];
  allBoxes.forEach((box, index) => {
    box.querySelector(".try-now-button").addEventListener("click", () => {
      /**  */
      isChatScreenVisible = true;

      const otherQuestions = allBoxes.filter((_, i) => i !== index);
      const chatBoxTitle = allQuestionsWrapper.querySelector("h4");
      const elementsToHide = gsap.utils.toArray([
        chatBoxTitle,
        ...otherQuestions,
      ]);
      botMovementControl.stop();

      gsap.to(elementsToHide, {
        opacity: 0,
        onComplete: () => {
          allQuestionsWrapper.style.display = "none";
          mainChatWrapper.style.display = "block";
          gsap.to(mainChatWrapper, {
            opacity: 1,
          });
        },
      });

      /** Init Main Chat screen */
      initMainChatScreen(box);
    });
  });
}

function resetBotPosition() {
  const botIcon = allQuestionsWrapper.querySelector(".chatbot-icon");

  botIcon.style.left = "65px";
  botIcon.style.top = "-10px";
}

function resetValues() {
  resetBotPosition();

  counter.updateCount(0);
  reverseController.update(false);

  const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];
  allBoxes.forEach(removeActiveClass);

  const chatScreenBot = mainChatWrapper.querySelector(".chatbot-icon-wrapper");
  chatScreenBot.style.left = -6;
  chatScreenBot.style.top = 0;
}

function createBotIconMovement() {
  let intervalId; // Encapsulated within the closure

  const start = () => {
    const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];

    intervalId = setInterval(() => {
      /**
       * if no active question is present, mark first one as active
       */
      const activeQuestionIndex = getActiveQuestionIndex();
      if (activeQuestionIndex < 0) {
        setActiveClass(allBoxes[0]);
      }

      const count = counter.getCount(); // gives the index of the next question (towards which the logo will move)
      const targetQuestionBox = allBoxes[count];

      const lastActiveQuestionIndex = getActiveQuestionIndex();

      // animate the logo
      gsapJumpingAnim = animateBotLogo(
        targetQuestionBox,
        lastActiveQuestionIndex,
      );

      allBoxes.forEach(removeActiveClass);

      setActiveClass(targetQuestionBox);

      let newShouldReverse = updateShouldReverse(
        count,
        allBoxes.length,
        reverseController.get(),
      );
      reverseController.update(newShouldReverse);
      const newCount = getNewCountValue(count, reverseController.get());

      counter.updateCount(newCount);
    }, 2000);
  };

  const stop = () => {
    clearInterval(intervalId);
    if (gsapJumpingAnim) {
      gsapJumpingAnim.kill();
      gsapJumpingAnim.invalidate();
    }

    // const botIcon = document.querySelector(".chatbot-icon");
    // gsapAnim = gsap.to(botIcon, {

    // })
  };

  return { start, stop };
}

function handleResize() {
  window.addEventListener("resize", repositionBotLogo);
}

/*********** */

function animateBotLogo(targetQuestionBox, lastActiveQuestionIndex) {
  const botIcon = allQuestionsWrapper.querySelector(".chatbot-icon");

  // the target top and left position
  const { top, left } = getPositionOfElement(targetQuestionBox);

  const isMovingTowardsLeft = isMovingLeft(
    lastActiveQuestionIndex,
    counter.getCount(),
  );

  const isMovingUp = getIsMovingUp(lastActiveQuestionIndex, counter.getCount());

  const tempTop = isMovingUp ? top - 60 : top - 45;
  const rotateZ = isMovingTowardsLeft ? -360 : 360;
  // const rotateZ = 360

  const tl = gsap.timeline();
  tl.set(botIcon, { rotateZ: 0 });
  tl.to(
    botIcon,
    {
      left: left - 40,
      rotateZ,
      duration: 0.5,
    },
    "0",
  );
  tl.to(
    botIcon,
    {
      top: tempTop,
      // ease : CustomEase.create("custom", "M0,0 C0.364,0.647 0.516,3, 1, 0.989 "),
      // rotateZ : 360,
    },
    "0",
  ).to(
    botIcon,
    {
      y: isMovingUp ? 0 : -20,
      top: top + targetQuestionBox.offsetHeight / 2 - 30,
      ease: "Bounce.easeOut",
    },
    "0.3",
  );
  // .to(botIcon, {
  // 	y : isMovingUp ? 0 : -20,
  // 	ease : Bounce.easeOut
  // }, "0.6")
  // top: top + (targetQuestionBox.offsetHeight / 2) - 20,
  // CustomEase.create("custom", "M0,0 C0.364,0.647 0.505,1.81 1,1 ")
  return tl;
}

function handleMouseMovement() {
  const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];

  allBoxes.forEach((questionBox, index) => {
    questionBox.addEventListener("mouseenter", () => {
      botMovementControl.stop();

      const newCount = getNewCountValue(index, reverseController.get());
      counter.updateCount(newCount);

      // if hovered on already active element, we do nothing
      if (questionBox.classList.contains("active")) return;

      let count = counter.getCount();

      /**
       * If hovered directly on the last question on page, load,
       * then, we need to set reverse to true
       */
      const currentReverseValue = reverseController.get();
      if (index === 4 && !currentReverseValue) {
        count = 3;
        reverseController.update(true);
      }
      if (index === 0) {
        count = 1;
        reverseController.update(false);
      }

      counter.updateCount(count);

      const activeQuestionIndex = getActiveQuestionIndex();
      if (activeQuestionIndex < 0) {
        setActiveClass(allBoxes[0]);
      }

      const lastActiveQuestionIndex = getActiveQuestionIndex();

      animateBotLogo(questionBox, lastActiveQuestionIndex);
      allBoxes.forEach(removeActiveClass);
      setActiveClass(questionBox);
    });

    questionBox.addEventListener("mouseleave", () => {
      if (gsapJumpingAnim) {
        gsapJumpingAnim.invalidate();
        gsapJumpingAnim.kill();
      }

      if (isChatScreenVisible) return;

      botMovementControl.start();
    });
  });
}

function repositionBotLogo() {
  const botIcon = allQuestionsWrapper.querySelector(".chatbot-icon");
  const currentActiveQuestionBox = allQuestionsWrapper.querySelector(
    ".question-box.active",
  );
  const { left } = getPositionOfElement(currentActiveQuestionBox);

  botIcon.style.left = `${left - 40}px`;
  // botIcon.style.top = `${top + (currentActiveQuestionBox.offsetHeight / 2) - 20}px`
}

function counterController() {
  let count = 0;

  const getCount = () => {
    return count;
  };
  const updateCount = (newCount) => {
    count = newCount;
  };

  return {
    getCount,
    updateCount,
  };
}

function addMainChatCloseListener() {
  const closeIcon = mainChatWrapper.querySelector(".close-main-chat");

  closeIcon.addEventListener("click", handleCloseChat);
}

function removeMainChatCloseListener() {
  const closeIcon = mainChatWrapper.querySelector(".close-main-chat");

  closeIcon.removeEventListener("click", handleCloseChat);
}

function handleCloseChat() {
  const allQuestions = allQuestionsWrapper.querySelectorAll(".question-box");
  const chatBoxTitle = allQuestionsWrapper.querySelector("h4");
  const elementsToShow = gsap.utils.toArray([
    ...allQuestions,
    chatBoxTitle,
    allQuestionsWrapper,
  ]);

  gsap.to(mainChatWrapper, {
    opacity: 0,
    onComplete: () => {
      addHideClass(mainChatWrapper.querySelector(".suggestions-and-input"));

      mainChatWrapper.style.display = "none";
      allQuestionsWrapper.style.display = "block";
      gsap.fromTo(
        elementsToShow,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
      );
      isChatScreenVisible = false;
      resetValues();
      botMovementControl.start();
    },
  });
}

/**
 * Main Chat Screen
 */

async function initMainChatScreen(lastClickedQuestion) {
  const existingChatItems = mainChatWrapper.querySelectorAll(".chat-item");
  const questionText = lastClickedQuestion.querySelector("h4").innerText;

  /**
   * Check if there are existing chat itesms present
   */
  if (existingChatItems.length > 1) {
    await addUserInputToChatScreen(questionText);
    const scrollValue = getTopValueForBot();
    scrollChatPartially(scrollValue);
    await makeAPIRequestAndShowResult(questionText);
    return;
  }

  const { left, top, right } = getPositionOfElement(lastClickedQuestion);

  const firstQuestion = mainChatWrapper.querySelector(".first-question");
  const type = lastClickedQuestion.getAttribute("fd-choice-type");
  firstQuestion.querySelector("h4").innerText = `${questionText}`;

  gsap.fromTo(
    firstQuestion,
    {
      top,
      right,
    },
    {
      top: 0,
      right: 0,
      duration: 1.2,
      ease: "sine.inOut",
      onComplete: async () => {
        await makeAPIRequestAndShowResult(questionText, type);
      },
    },
  );
}

async function makeAPIRequestAndShowResult(text, type = "text") {
  /** Append this selected question to the secondary chatbot too and disable the input field */
  appendUserInputToChatScreen(text);
  const inputElement = secondaryChatbotContainer.querySelector("textarea");

  inputElement.disabled = true;

  await setBotPositionAndShowLoader();
  addHideClass(mainChatWrapper.querySelector(".choices"));

  const { error, data, message } = await makeAPIRequest(text, type);

  if (error) {
    handleError(message);
  } else {
    const { responsesToShow, choices } = extractDataFromResponse(data);

    await hideLoader();
    renderSuccessOutput(responsesToShow);

    await renderChoices(choices);
    addClickListenerToMainChatChoices();

    /** Append this reponse and choices to the secondary chatbot too */
    renderSecondaryChatResult(responsesToShow);
    if (Array.isArray(choices) && choices.length) {
      renderSecondaryChatChoices(choices);
    }
    inputElement.disabled = false;

    showInputBox();
  }
}

function renderSuccessOutput(allResponses) {
  const scrollValue = getTopValueForBot();

  allResponses.forEach((response, index) => {
    const tempDiv = document.createElement("div");

    if (response.type === "text") {
      const text = response.payload.message;
      const paragraphs = text.split("\n");

      paragraphs.forEach((paragraph) => {
        if (paragraph.trim() !== "") {
          const p = document.createElement("p");
          p.textContent = paragraph.trim();
          tempDiv.appendChild(p);
        }
      });
    }

    if (response.type === "visual") {
      const imgLink = response.payload.image;
      const img = document.createElement("img");
      img.setAttribute("src", imgLink);

      tempDiv.appendChild(img);
    }

    mainChatWrapper.querySelector(
      ".chat-wrapper .chats",
    ).innerHTML += `<div class="chat-item response-box ${
      index > 0 ? "negative-margin" : ""
    }">
    <p>${tempDiv.innerHTML}</p>
  </div>`;
  });

  removeMainChatCloseListener();
  addMainChatCloseListener();

  scrollChatPartially(scrollValue);

  // saveToSessionStorage(mainChatWrapper)
}

function loadChatsFromSessionStorage() {
  const chats = JSON.parse(sessionStorage.getItem("bot-chats"));

  if (chats && chats.length) {
    /** Remove existing chats */
    secondaryChatbotContainer.querySelectorAll(".chat-item").forEach((item) => {
      item.remove();
    });
    mainChatWrapper.querySelectorAll(".chat-item").forEach((item) => {
      item.remove();
    });

    chats.forEach((chatItem) => {
      const div = document.createElement("div");
      div.innerHTML = chatItem;
      const chatElementToAdd = div.querySelector("div");
      if (chatElementToAdd.classList.contains("question-box")) {
        chatElementToAdd.classList.add("user-input");
      }

      gsap.set(chatElementToAdd, { opacity: 1 });
      secondaryChatbotContainer
        .querySelector(".chats")
        .append(chatElementToAdd);

      mainChatWrapper.querySelector(".chats").append(chatElementToAdd);
    });
  }
}

function renderChoices(choices) {
  return new Promise((resolve) => {
    const choicesDiv = mainChatWrapper.querySelector(".choices");

    addHideClass(choicesDiv);

    choicesDiv.innerHTML = "";

    if (choices && choices.length) {
      choices.forEach((choice) => {
        choicesDiv.innerHTML += `<span class="choice" fd-redirect="${choice.url}" fd-choice-type='${choice.type}' >${choice.name}</span>`;
      });
    }
    removeHideClass(choicesDiv);
    removeHideClass(mainChatWrapper.querySelector(".suggestions-and-input"));
    showChoicesAndInputBox();
    resolve();
  });
}

function addChatInputListener() {
  const inputElement = mainChatWrapper.querySelector(".chat-input");

  const handleSubmitEvent = async (userInput) => {
    hideChoicesAndInput();
    await addUserInputToChatScreen(userInput);
    await makeAPIRequestAndShowResult(userInput);
  };

  inputElement.addEventListener("keypress", async function (e) {
    const keyPressed = e.keyCode ? e.keyCode : e.which;

    if (keyPressed === 13) {
      const inputTextValue = inputElement.value;
      if (!inputTextValue) return;
      await handleSubmitEvent(inputTextValue);
      inputElement.value = "";
    }
  });

  const inputArrowSubmitBtn = mainChatWrapper.querySelector(
    ".chat-input-wrap svg",
  );
  inputArrowSubmitBtn.addEventListener("click", async function () {
    const inputTextValue = inputElement.value;
    if (!inputTextValue) return;
    await handleSubmitEvent(inputTextValue);
    inputElement.value = "";
  });
}

function addClickListenerToMainChatChoices() {
  const choices = mainChatWrapper.querySelectorAll(".choices .choice");
  choices.forEach((choice) =>
    choice.addEventListener("click", async function () {
      if (
        choice.getAttribute("fd-redirect") &&
        choice.getAttribute("fd-redirect") !== "undefined"
      ) {
        const redirectUrl = choice.getAttribute("fd-redirect");
        window.location.href = redirectUrl;
        return;
      }

      const choiceText = choice.innerText;
      const type = choice.getAttribute("fd-choice-type");

      hideChoicesAndInput();
      await addUserInputToChatScreen(choiceText);
      await makeAPIRequestAndShowResult(choiceText, type);
    }),
  );
}

function showChoicesAndInputBox() {
  const allChoices = mainChatWrapper.querySelectorAll(".choices .choice");
  const chatInput = mainChatWrapper.querySelector(".chat-input-wrap");

  removeHideClass(chatInput);
  const elementsToShow = gsap.utils.toArray([allChoices, chatInput]);
  gsap.fromTo(
    elementsToShow,
    {
      opacity: 0,
      y: 10,
    },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
    },
  );
}

function showInputBox() {
  const chatInput = mainChatWrapper.querySelector(".chat-input-wrap");
  gsap.fromTo(
    chatInput,
    {
      opacity: 0,
      y: 10,
    },
    {
      opacity: 1,
      y: 0,
    },
  );
}

async function addUserInputToChatScreen(userInputText) {
  const chats = mainChatWrapper.querySelector(".chats");

  const elementToAdd = `<div class="chat-item question-box user-input">
    <h4 class="question-box-question">${userInputText}</h4>
  </div>`;
  chats.innerHTML += elementToAdd;

  const lastChatElement = getLastChatItem();

  scrollToChatEnding();
  await revealUserInput(lastChatElement);
}

function setBotPositionAndShowLoader() {
  return new Promise((resolve) => {
    showLoader();
    const bot = mainChatWrapper.querySelector(".chatbot-icon-wrapper");

    const currentHeight = getTopValueForBot();

    gsap.to(bot, {
      top: currentHeight,
      ease: "ease",
      onComplete: resolve,
    });
  });
}

function hideChoicesAndInput() {
  const allChoices = mainChatWrapper.querySelectorAll(".choices .choice");
  const chatInput = mainChatWrapper.querySelector(".chat-input-wrap");

  addHideClass(chatInput);
  const elementsToShow = gsap.utils.toArray([allChoices, chatInput]);
  gsap.to(elementsToShow, {
    opacity: 0,
    y: 10,
  });
}

function revealUserInput(element) {
  return new Promise((resolve) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        // delay : 0.4,
        onComplete: resolve,
      },
    );
  });
}

function addHideClass(element) {
  element.classList.add("hide");
}
function removeHideClass(element) {
  element.classList.remove("hide");
}

function scrollToChatEnding() {
  const chatScreen = mainChatWrapper.querySelector(".chats");

  const val = getTopValueForBot();
  chatScreen.scrollTo({
    top: val,
    behavior: "smooth",
  });
}

function scrollChatPartially(value) {
  const chatScreen = mainChatWrapper.querySelector(".chats");
  chatScreen.scrollTo({
    top: value,
    behavior: "smooth",
  });
}

function hideLoader() {
  return new Promise((resolve) => {
    const botLoader = mainChatWrapper
      .querySelector(".chats .chatbot-icon-wrapper")
      .querySelector(".bot-loader");

    gsap.to(botLoader, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        botLoader.style.display = "none";
        resolve();
      },
    });
  });
}

function showLoader() {
  // return new Promise(resolve => {
  //   botLoader.style.display = "block"
  //   const botLoader = mainChatWrapper.querySelector(".chats .chatbot-icon-wrapper").querySelector(".bot-loader")

  //   gsap.to(botLoader, {
  //     opacity: 1,
  //     duration: 0.2,
  //     onComplete: () => {
  //       resolve()
  //     }
  //   })
  // })

  const botLoader = mainChatWrapper
    .querySelector(".chats .chatbot-icon-wrapper")
    .querySelector(".bot-loader");
  botLoader.style.display = "block";

  gsap.to(botLoader, {
    opacity: 1,
    duration: 0.2,
  });
}

function getTopValueForBot() {
  let totalHeight = 0;
  const allChatItems = mainChatWrapper.querySelectorAll(".chat-item");
  let negativeMarginResponses = 0;

  allChatItems.forEach((item) => {
    totalHeight += item.offsetHeight + 30;

    if (item.classList.contains("negative-margin")) {
      negativeMarginResponses++;
    }
  });
  return (
    totalHeight - allChatItems.length * 5 + 60 - negativeMarginResponses * 16
  );
}

function handleError(errMessage) {
  console.error({ error: errMessage });
}

async function makeAPIRequest(text, type) {
  // Cancel previous request if it exists
  if (controller) {
    controller.abort();
  }

  // Create a new AbortController
  controller = new AbortController();
  const { signal } = controller;

  const API_ENDPOINT = `https://general-runtime.voiceflow.com/state/user/${getOrSetUUIDSessionStorage()}/interact`;
  const API_KEY = `VF.DM.65df5409684f33402629843c.CLK9k8XYwRxE7pbz`;

  const action =
    type !== "text"
      ? {
          type: type,
          payload: {
            label: `${text}`,
          },
        }
      : {
          type: "text",
          payload: `${text}`,
        };

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      versionID: "65df5123b93dbe8b0c12a50c",
      projectID: "65df5123b93dbe8b0c12a50b",
      "content-type": "application/json",
      Authorization: API_KEY,
    },
    body: JSON.stringify({
      action,
      versionID: "65df5123b93dbe8b0c12a50c",
      projectID: "65df5123b93dbe8b0c12a50b",
      state: {
        variables: {
          toplyne_user_id: getOrSetUUIDLocalStorage(),
          toplyne_session_id: getOrSetUUIDSessionStorage(),
        },
      },
      config: {
        tts: false,
        stripSSML: true,
        stopAll: true,
        excludeTypes: ["block", "debug", "flow"],
      },
    }),
  };

  try {
    const resp = await fetch(API_ENDPOINT, { ...options, signal });

    const data = await resp.json();
    console.log({ data });

    await makeTranscriptRequest();

    controller = null;

    return {
      error: false,
      data,
    };
  } catch (error) {
    console.log("ERROR Intreaction request ", error);
    return {
      error: true,
      message: error?.response?.data?.message || error.message,
    };
  }
}

async function makeTranscriptRequest() {
  const url = "https://api.voiceflow.com/v2/transcripts";
  const API_KEY = `VF.DM.65df5409684f33402629843c.CLK9k8XYwRxE7pbz`;
  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: API_KEY,
    },
    body: JSON.stringify({
      sessionID: getOrSetUUIDSessionStorage(),
      versionID: "65df5123b93dbe8b0c12a50c",
      projectID: "65df5123b93dbe8b0c12a50b",
      device: getOrSetUUIDLocalStorage(),
      browser: getOrSetUUIDSessionStorage(),
    }),
  };

  try {
    const resp = await fetch(url, options);
    const data = await resp.json();
    console.log({ transript: data });
  } catch (error) {
    console.log("Error making transcript request ", error);
  }
}

function getLastChatItem() {
  const allChatItems = [
    ...mainChatWrapper.querySelectorAll(".chat-wrapper .chats>div.chat-item"),
  ];
  return allChatItems[allChatItems.length - 1];
}

function extractDataFromResponse(data) {
  // const responsesToShow = data.trace.filter(item => item.type === "text" || item.type === "visual")

  const responsesToShow = data.filter(
    (item) => item.type === "text" || item.type === "visual",
  );

  // const textsToShow = messagePayloads.map(item => item.payload.message)

  const choices = data
    .find((item) => item.type === "choice")
    ?.payload?.buttons?.map((btn) => {
      const actionWithUrl = btn?.request?.payload?.actions?.find(
        (action) => action.type === "open_url",
      );
      let url = undefined;

      if (actionWithUrl) {
        url = actionWithUrl.payload.url;
      }
      return {
        name: btn.name,
        type: btn.request.type,
        url,
      };
    });
  return {
    responsesToShow,
    choices,
  };
}

/**
 * UTILS
 */

function extractNewHeadersState(data) {
  return data?.state;
}

function getPositionOfElement(element, container) {
  const containerRect =
    container ??
    document.querySelector(".chat-screen-wrapper").getBoundingClientRect();
  const { top, bottom, left, right } = element.getBoundingClientRect();
  return {
    top: Math.abs(top - containerRect.top),
    bottom: Math.abs(bottom - containerRect.bottom),
    left: Math.abs(left - containerRect.left),
    right: Math.abs(right - containerRect.right),
  };
}

function updateShouldReverse(count, allBoxesLength, lastReverseValue) {
  if (count >= allBoxesLength - 1) {
    return true; // Reverse when at the last element
  } else if (count <= 0) {
    return false; // Don't reverse when at the first element
  }
  return lastReverseValue;
}

function getNewCountValue(count, shouldReverse) {
  if (shouldReverse) return count - 1;
  else return count + 1;
}

function removeActiveClass(element) {
  element.classList.remove("active");
}

function setActiveClass(element) {
  element.classList.add("active");
}

function getActiveQuestionIndex() {
  const allQuestionsWrapper = document.querySelector(".all-questions-wrapper");
  const allQuestions = [
    ...allQuestionsWrapper.querySelectorAll(".question-box"),
  ];

  return allQuestions.findIndex((el) => el.classList.contains("active"));
}

function lastActiveQuestionTracker() {
  let index = 0;
  const setIndex = (newIndex) => {
    index = newIndex;
  };

  const getIndex = () => {
    return index;
  };

  return {
    setIndex,
    getIndex,
  };
}

function shouldReverseController() {
  let shouldReverse = false;

  const update = (value) => {
    shouldReverse = value;
  };

  const get = () => {
    return shouldReverse;
  };

  return {
    update,
    get,
  };
}

function getIsMovingUp(lastIndex, targetIndex) {
  return targetIndex < lastIndex;
}

function isMovingLeft(lastElementIndex, targetElementIndex) {
  const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];

  const { left: lastElementLeftValue } = getPositionOfElement(
    allBoxes[lastElementIndex],
  );
  const { left: targetElementLeftValue } = getPositionOfElement(
    allBoxes[targetElementIndex],
  );

  return targetElementLeftValue < lastElementLeftValue;
}

/**
 * SECONDARY CHATBOT FUNCTIONALITY
 */

const secondaryChatbotContainer = document.querySelector(".secondary-chatbot");
let isSecondaryChatClosed = true;

addSecondaryChatInputListener();

addCloseSecondaryChatClickListener();

addScrollListener();

function addScrollListener() {
  let isSecondaryChatVisible = false;

  document.addEventListener("scroll", () => {
    if (window.scrollY > 700) {
      if (isSecondaryChatVisible) return;
      showSecondaryChatInput();
      isSecondaryChatVisible = true;
    } else {
      const isChatWindowOpened =
        secondaryChatbotContainer.classList.contains("is-open");

      if (!isSecondaryChatVisible || isChatWindowOpened) return;
      hideSecondaryChatbotCompletely();
      isSecondaryChatVisible = false;
    }
  });
}

let timeoutId;

function hideSecondaryChatbotCompletely() {
  clearTimeout(timeoutId);
  const chatbotIconWrapper = secondaryChatbotContainer.querySelector(
    ".chatbot-icon-wrapper",
  );
  secondaryChatbotContainer.classList.remove("is-open");

  const tl = gsap.timeline({
    onComplete: () => {
      timeoutId = setTimeout(() => {
        secondaryChatbotContainer.querySelector(
          ".input-container",
        ).style.visibility = "hidden";
      }, 50);
    },
  });

  tl.to(secondaryChatbotContainer.querySelector(".input-wrapper"), {
    width: 0,
    duration: 0.3,
    delay: 0.3,
  });
  tl.to(
    chatbotIconWrapper,
    {
      top: 0,
      opacity: 0,
      duration: 0.3,
    },
    "<",
  );
  handleCloseSecondaryChat();
}

async function showSecondaryChatInput() {
  clearTimeout(timeoutId);
  const tl = gsap.timeline();

  removeHideClass(
    secondaryChatbotContainer.querySelector(".secondary-chatbot-wrapper"),
  );
  const inputWrapper =
    secondaryChatbotContainer.querySelector(".input-wrapper");
  const chatbotIconWrapper = secondaryChatbotContainer.querySelector(
    ".chatbot-icon-wrapper",
  );
  const iconWrapper = secondaryChatbotContainer.querySelector(
    ".input-wrapper span",
  );

  isSecondaryChatClosed = true;
  await repositionSecondaryChatBot();

  secondaryChatbotContainer.querySelector(".input-container").style.width =
    "auto";
  secondaryChatbotContainer.querySelector(".input-container").style.visibility =
    "visible";
  secondaryChatbotContainer.style.visibility = "visible";

  gsap.set(secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper"), {
    top: window.innerWidth > 992 ? "-8px" : "0px",
  });

  tl.to(
    chatbotIconWrapper,
    {
      opacity: 1,
      duration: 0.3,
      onComplete: () => {
        chatbotIconWrapper.style.display = "flex";
      },
    },
    "start",
  );
  tl.to(
    inputWrapper,
    {
      scale: 1,
      duration: 0.5,
      width: 380,
    },
    "start",
  );
  tl.to(
    inputWrapper.querySelector("textarea"),
    {
      opacity: 1,
      duration: 0.3,
    },
    "<",
  );
  tl.to(
    iconWrapper,
    {
      right: 10,
      scale: 1,
      duration: 0.3,
    },
    "<",
  );

  return tl;
}

async function handleAPIResponse(resp) {
  if (resp.error) {
    // show error message
    return;
  }

  const { responsesToShow, choices } = extractDataFromResponse(resp.data);
  await hideSecondaryChatBotLoader();
  renderSecondaryChatResult(responsesToShow);

  if (Array.isArray(choices) && choices.length) {
    renderSecondaryChatChoices(choices);
  }
  /**
   * Append this response and choices to hero chatbot
   */
  renderSuccessOutput(responsesToShow);
  renderChoices(choices);
  addClickListenerToMainChatChoices();
}

function saveToSessionStorage(container) {
  const chatItems = container.querySelectorAll(".chat-item");

  // Convert NodeList to an array for easier manipulation
  const chatItemsArray = Array.from(chatItems);

  // Define an array to store the HTML content of each chat item
  const chatItemsContent = [];

  // Loop through each chat item and store its HTML content
  chatItemsArray.forEach((chatItem) => {
    chatItemsContent.push(chatItem.outerHTML);
  });

  // Convert the array of chat item HTML content to a JSON string
  const chatItemsJson = JSON.stringify(chatItemsContent);

  // Store the JSON string in session storage
  sessionStorage.setItem("bot-chats", chatItemsJson);
}

function hideSecondaryChatBotLoader() {
  return new Promise((resolve) => {
    const botIcon = secondaryChatbotContainer.querySelector(
      ".chatbot-icon-wrapper",
    );

    gsap.to(botIcon.querySelector(".bot-loader"), {
      opacity: 0,
      onComplete: () => {
        removeHideClass(botIcon);
        resolve();
      },
    });
  });
}

function showSecondaryChatBotLoader() {
  return new Promise((resolve) => {
    const botIcon = secondaryChatbotContainer.querySelector(
      ".chatbot-icon-wrapper",
    );

    gsap.to(botIcon.querySelector(".bot-loader"), {
      opacity: 1,
      onComplete: () => {
        removeHideClass(botIcon);
        resolve();
      },
    });
  });
}

function renderSecondaryChatResult(allResponses) {
  const scrollValue = getSecondaryChatBotIconNewPosition();

  allResponses.forEach((response, index) => {
    const tempDiv = document.createElement("div");

    if (response.type === "text") {
      const text = response.payload.message;
      const paragraphs = text.split("\n");

      paragraphs.forEach((paragraph) => {
        if (paragraph.trim() !== "") {
          const p = document.createElement("p");
          p.textContent = paragraph.trim();
          tempDiv.appendChild(p);
        }
      });
    }

    if (response.type === "visual") {
      const imgLink = response.payload.image;
      const img = document.createElement("img");
      img.setAttribute("src", imgLink);

      tempDiv.appendChild(img);
    }

    secondaryChatbotContainer.querySelector(
      ".chats",
    ).innerHTML += `<div class="chat-item response-box ${
      index > 0 ? "negative-margin" : ""
    }">
      <p>${tempDiv.innerHTML}</p>
    </div>`;
  });

  scrollSecondaryChatPartially(scrollValue);

  // enable the input
  const inputElement = secondaryChatbotContainer.querySelector("textarea");

  inputElement.disabled = false;

  // saveToSessionStorage(secondaryChatbotContainer)
}

function renderSecondaryChatChoices(choices) {
  const choicesDiv = secondaryChatbotContainer.querySelector(".choices");
  removeHideClass(choicesDiv);
  choicesDiv.innerHTML = "";

  if (!isSecondaryChatClosed) {
    addHideClass(choicesDiv);
    return;
  }

  choices.forEach((choice) => {
    choicesDiv.innerHTML += `<div class='choice'  fd-choice-type='${choice.type}'>${choice.name}</div>`;
  });

  gsap.fromTo(
    choicesDiv.querySelectorAll(".choice"),
    {
      opacity: 0,
      y: 10,
    },
    {
      opacity: 1,
      stagger: 0.1,
      y: 0,
    },
  );

  addClickListenerToSecondaryChatBotChoices();
}

function scrollSecondaryChatPartially(value) {
  const chatScreen = secondaryChatbotContainer.querySelector(".chats");
  chatScreen.scrollTo({
    top: value,
    behavior: "smooth",
  });
}

function repositionSecondaryChatBot() {
  return new Promise((resolve) => {
    const newPos = getSecondaryChatBotIconNewPosition();

    const botIcon = secondaryChatbotContainer.querySelector(
      ".chatbot-icon-wrapper",
    );

    gsap.to(botIcon, {
      top: newPos,
      onComplete: resolve,
    });
  });
}

function getSecondaryChatBotIconNewPosition() {
  let totalHeight = 0;
  const allChatItems = secondaryChatbotContainer.querySelectorAll(".chat-item");

  if (!allChatItems?.length) return -8;
  let negativeMarginResponses = 0;

  allChatItems.forEach((item) => {
    if (item.classList.contains("negative-margin")) {
      negativeMarginResponses++;
    }

    totalHeight += item.offsetHeight + 36;
  });

  return totalHeight + 28 - negativeMarginResponses * 20;
}

function addClickListenerToSecondaryChatBotChoices() {
  const choices =
    secondaryChatbotContainer.querySelectorAll(".choices .choice");
  choices.forEach((choice) => {
    choice.addEventListener("click", async function () {
      if (
        choice.getAttribute("fd-redirect") &&
        choice.getAttribute("fd-redirect") !== "undefined"
      ) {
        const redirectUrl = choice.getAttribute("fd-redirect");
        window.location.href = redirectUrl;
        return;
      }

      const text = choice.innerText;
      const type = choice.getAttribute("fd-choice-type");
      await handleUserInteraction(text, type);
    });
  });
}

function addSecondaryChatInputListener() {
  const inputElement = secondaryChatbotContainer.querySelector("textarea");
  const inputArrowSubmitBtn = secondaryChatbotContainer.querySelector(
    ".input-wrapper span>svg",
  );

  inputElement.addEventListener("keypress", async function (e) {
    const keyPressed = e.keyCode ? e.keyCode : e.which;

    if (keyPressed === 13) {
      const inputTextValue = inputElement.value;
      if (!inputTextValue) return;
      inputElement.value = "";
      secondaryChatbotContainer.classList.add("is-open");
      await handleUserInteraction(inputTextValue);
    }
  });

  inputArrowSubmitBtn.addEventListener("click", async function () {
    const inputTextValue = inputElement.value;
    if (!inputTextValue) return;
    inputElement.value = "";
    secondaryChatbotContainer.classList.add("is-open");
    await handleUserInteraction(inputTextValue);
  });
}

async function handleUserInteraction(text, type = "text") {
  /**
   * Add this text to the hero chatbot too
   */
  const chats = mainChatWrapper.querySelector(".chats");
  // remove the first-question box if there's only one chat item
  const existingChatItems = chats.querySelectorAll(".chat-item");
  if (
    existingChatItems.length === 1 &&
    existingChatItems[0].classList.contains("first-question")
  ) {
    existingChatItems[0].remove();
  }

  const elementToAdd = `<div class="chat-item question-box user-input">
    <h4 class="question-box-question">${text}</h4>
  </div>`;

  gsap.set(secondaryChatbotContainer.querySelector(".input-wrapper"), {
    width: window.innerWidth > 992 ? 500 : "calc(100vw - 70px)",
  });

  chats.innerHTML += elementToAdd;
  gsap.set(chats.querySelectorAll(".chat-item"), { opacity: 1 });

  const inputElement = secondaryChatbotContainer.querySelector("textarea");
  inputElement.disabled = true;

  addHideClass(secondaryChatbotContainer.querySelector(".choices"));

  appendUserInputToChatScreen(text);

  await repositionSecondaryChatBot();
  showSecondaryChatBotLoader();

  const scrollValue = getSecondaryChatBotIconNewPosition();
  scrollSecondaryChatPartially(scrollValue);

  const resp = await makeAPIRequest(text, type);

  await handleAPIResponse(resp);
}

function addCloseSecondaryChatClickListener() {
  const closeIcon = secondaryChatbotContainer.querySelector(".close-chat");

  closeIcon.addEventListener("click", handleCloseSecondaryChat);
}

function addInputFocusListener() {
  const mainBotInput = document.querySelector(".chat-input-wrap textarea");
  const secondaryChatInput = document.querySelector(
    ".secondary-chatbot-wrapper textarea",
  );

  [mainBotInput, secondaryChatInput].forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentNode.style.borderColor = "#1553F0";
      input.parentElement.querySelector("svg path").style.fill = "#1553F0";
    });

    input.addEventListener("blur", () => {
      input.parentNode.style.borderColor = "#DAE3E8";
      input.parentElement.querySelector("svg path").style.fill = "#666D80";
    });
  });
}

function handleCloseSecondaryChat() {
  secondaryChatbotContainer.classList.remove("is-open");

  isSecondaryChatClosed = true;

  gsap.set(secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper"), {
    opacity: 0,
    top: window.innerWidth > 992 ? "-8px" : "0px",
  });

  gsap.set(secondaryChatbotContainer.querySelector(".input-wrapper"), {
    width: 380,
  });
  gsap.to(secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper"), {
    duration: 0.3,
    opacity: 1,
  });
}

function appendUserInputToChatScreen(text) {
  const allChatsDiv = secondaryChatbotContainer.querySelector(".chats");

  const responseDiv = document.createElement("div");
  responseDiv.classList.add("chat-item");
  responseDiv.classList.add("question-box");
  responseDiv.innerHTML = `<h4 class='question-box-question'>${text}</h4>`;

  allChatsDiv.append(responseDiv);
}

function generateGuid() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
