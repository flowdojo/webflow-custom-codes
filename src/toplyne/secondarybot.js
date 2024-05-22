
const secondaryChatbotContainer = document.querySelector(".secondary-chatbot")
let isSecondaryChatClosed = true
const UNIQUE_USER_ID = sessionStorage.getItem("UNIQUE_USER_ID") ? sessionStorage.getItem("UNIQUE_USER_ID") : generateGuid()
sessionStorage.setItem("UNIQUE_USER_ID", UNIQUE_USER_ID)

addSecondaryChatInputListener()

addCloseSecondaryChatClickListener()

addScrollListener()

/**
   * load previous chats from session storage
*/

loadChatsFromSessionStorage()

function addScrollListener() {
  let isSecondaryChatVisible = false;

  document.addEventListener("scroll", () => {
    if (window.scrollY > 700) {
      if (isSecondaryChatVisible) return
      showSecondaryChatInput()
      isSecondaryChatVisible = true
    } else {
      const isChatWindowOpened = secondaryChatbotContainer.classList.contains("is-open")

      if (!isSecondaryChatVisible || isChatWindowOpened) return
      hideSecondaryChatbotCompletely()
      isSecondaryChatVisible = false
    }
  })

}

function loadChatsFromSessionStorage() {
    const chats = JSON.parse(sessionStorage.getItem("bot-chats"))
    
    if (chats && chats.length > 0) {
        chats.forEach(chatItem => {
            const div = document.createElement("div")
            div.innerHTML = chatItem
            secondaryChatbotContainer.querySelector(".chats").append(div)
        })
    }
}


let timeoutId;

function hideSecondaryChatbotCompletely() {

  clearTimeout(timeoutId)

  const chatbotIconWrapper = secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper")
  secondaryChatbotContainer.classList.remove("is-open")

  const tl = gsap.timeline({
    onComplete: () => {
      timeoutId = setTimeout(() => {
        secondaryChatbotContainer.querySelector(".input-container").style.visibility = "hidden"
      }, 50)
    }
  })




  tl.to(secondaryChatbotContainer.querySelector(".input-wrapper"), {
    width: 0,
    duration: 0.3,
    delay: 0.3
  })
  tl.to(chatbotIconWrapper, {
    top: 0,
    opacity: 0,
    duration: 0.3,
  }, "<")
  handleCloseSecondaryChat()

}


async function showSecondaryChatInput() {
  clearTimeout(timeoutId)
  const tl = gsap.timeline()

  removeHideClass(secondaryChatbotContainer.querySelector(".secondary-chatbot-wrapper"))
  const inputWrapper = secondaryChatbotContainer.querySelector(".input-wrapper")
  const chatbotIconWrapper = secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper")
  const iconWrapper = secondaryChatbotContainer.querySelector(".input-wrapper span")


  isSecondaryChatClosed = true
  await repositionSecondaryChatBot()

  secondaryChatbotContainer.querySelector(".input-container").style.width = "auto"
  secondaryChatbotContainer.querySelector(".input-container").style.visibility = "visible"
  secondaryChatbotContainer.style.visibility = "visible"

  gsap.set(secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper"), {
    top: window.innerWidth > 992 ? "-8px" : "0px",
  })


  tl.to(chatbotIconWrapper, {
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
      chatbotIconWrapper.style.display = "flex"
    }
  }, 'start')
  tl.to(inputWrapper, {
    scale: 1,
    duration: 0.5,
    width: 225,
  }, 'start')
  tl.to(inputWrapper.querySelector("input"), {
    opacity: 1,
    duration: 0.3
  }, "<")
  tl.to(iconWrapper, {
    right: 10,
    scale: 1,
    duration: 0.3
  }, "<")

  return tl
}



async function handleAPIResponse(resp) {
  if (resp.error) {
    // show error message
    return
  }

  const { responsesToShow, choices } = extractDataFromResponse(resp.data)
  await hideSecondaryChatBotLoader()
  renderSecondaryChatResult(responsesToShow)

  if (Array.isArray(choices) && choices.length) {
    renderSecondaryChatChoices(choices)
  }
  /**
    * Append this response and choices to hero chatbot 
  */
  renderSuccessOutput(responsesToShow)
  renderChoices(choices)
  addClickListenerToMainChatChoices()
}


function saveToSessionStorage(container) {
  const chatItems = container.querySelectorAll(".chat-item");

  // Convert NodeList to an array for easier manipulation
  const chatItemsArray = Array.from(chatItems);
  
  // Define an array to store the HTML content of each chat item
  const chatItemsContent = [];
  
  // Loop through each chat item and store its HTML content
  chatItemsArray.forEach(chatItem => {
      chatItemsContent.push(chatItem.outerHTML);
  });
  
  // Convert the array of chat item HTML content to a JSON string
  const chatItemsJson = JSON.stringify(chatItemsContent);
  
  // Store the JSON string in session storage
  sessionStorage.setItem("bot-chats", chatItemsJson);
}


function hideSecondaryChatBotLoader() {
  return new Promise(resolve => {
    const botIcon = secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper")

    gsap.to(botIcon.querySelector('.bot-loader'), {
      opacity: 0,
      onComplete: () => {
        removeHideClass(botIcon)
        resolve()
      }
    })
  })
}

function showSecondaryChatBotLoader() {
  return new Promise(resolve => {
    const botIcon = secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper")

    gsap.to(botIcon.querySelector('.bot-loader'), {
      opacity: 1,
      onComplete: () => {
        removeHideClass(botIcon)
        resolve()
      }
    })

  })
}

function renderSecondaryChatResult(allResponses) {

  const scrollValue = getSecondaryChatBotIconNewPosition()

  allResponses.forEach((response, index) => {
    const tempDiv = document.createElement("div")


    if (response.type === "text") {
      const text = response.payload.message
      const paragraphs = text.split("\n")

      paragraphs.forEach(paragraph => {
        if (paragraph.trim() !== '') {
          const p = document.createElement('p');
          p.textContent = paragraph.trim();
          tempDiv.appendChild(p);
        }
      })
    }

    if (response.type === "visual") {
      const imgLink = response.payload.image;
      const img = document.createElement("img")
      img.setAttribute("src", imgLink)

      tempDiv.appendChild(img)
    }

    secondaryChatbotContainer.querySelector(".chats").innerHTML += `<div class="chat-item response-box ${index > 0 ? "negative-margin" : ""}">
      <p>${tempDiv.innerHTML}</p>
    </div>`
  })


  scrollSecondaryChatPartially(scrollValue)

  // enable the input
  const inputElement = secondaryChatbotContainer.querySelector("input")

  inputElement.disabled = false

  saveToSessionStorage(secondaryChatbotContainer)
}



function renderSecondaryChatChoices(choices) {
  const choicesDiv = secondaryChatbotContainer.querySelector(".choices")
  removeHideClass(choicesDiv)
  choicesDiv.innerHTML = ""


  if (!isSecondaryChatClosed) {
    addHideClass(choicesDiv)
    return
  }

  choices.forEach(choice => {
    choicesDiv.innerHTML += `<div class='choice'  fd-choice-type='${choice.type}'>${choice.name}</div>`
  })


  gsap.fromTo(choicesDiv.querySelectorAll(".choice"), {
    opacity: 0,
    y: 10,
  }, {
    opacity: 1,
    stagger: 0.1,
    y: 0,
  })

  addClickListenerToSecondaryChatBotChoices()

}


function scrollSecondaryChatPartially(value) {
  const chatScreen = secondaryChatbotContainer.querySelector(".chats")
  chatScreen.scrollTo({
    top: value,
    behavior: "smooth",
  })
}


function repositionSecondaryChatBot() {
  return new Promise(resolve => {
    const newPos = getSecondaryChatBotIconNewPosition()

    const botIcon = secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper")

    gsap.to(botIcon, {
      top: newPos,
      onComplete: resolve
    })

  })
}


function getSecondaryChatBotIconNewPosition() {
  let totalHeight = 0;
  const allChatItems = secondaryChatbotContainer.querySelectorAll(".chat-item")

  if (!allChatItems?.length) return -8
  let negativeMarginResponses = 0

  allChatItems.forEach(item => {
    if (item.classList.contains("negative-margin")) {
      negativeMarginResponses++
    }

    totalHeight += item.offsetHeight + 36
  })

  return totalHeight + 28 - (negativeMarginResponses * 20)
}


function addClickListenerToSecondaryChatBotChoices() {
  const choices = secondaryChatbotContainer.querySelectorAll(".choices .choice")
  choices.forEach(choice => {
    choice.addEventListener("click", async function () {
      const text = choice.innerText;
      const type = choice.getAttribute("fd-choice-type")
      await handleUserInteraction(text, type)


    })
  })
}


function addSecondaryChatInputListener() {
  const inputElement = secondaryChatbotContainer.querySelector("input")
  const inputArrowSubmitBtn = secondaryChatbotContainer.querySelector(".input-wrapper span>svg")

  inputElement.addEventListener("keypress", async function (e) {
    const keyPressed = (e.keyCode ? e.keyCode : e.which)

    if (keyPressed === 13) {
      const inputTextValue = inputElement.value
      if (!inputTextValue) return
      inputElement.value = ""
      secondaryChatbotContainer.classList.add("is-open")
      await handleUserInteraction(inputTextValue)
    }


  })

  inputArrowSubmitBtn.addEventListener("click", async function () {
    const inputTextValue = inputElement.value
    if (!inputTextValue) return
    inputElement.value = ""
    secondaryChatbotContainer.classList.add("is-open")
    await handleUserInteraction(inputTextValue)
  })
}






async function handleUserInteraction(text, type = "text") {


  gsap.set(secondaryChatbotContainer.querySelector(".input-wrapper"), {
    width : window.innerWidth > 992 ? 500 : 'calc(100vw - 70px)'
  })


  const inputElement = secondaryChatbotContainer.querySelector("input")
  inputElement.disabled = true

  addHideClass(secondaryChatbotContainer.querySelector(".choices"))

  appendUserInputToChatScreen(text)

  await repositionSecondaryChatBot()
  showSecondaryChatBotLoader()

  const scrollValue = getSecondaryChatBotIconNewPosition()
  scrollSecondaryChatPartially(scrollValue)

  const resp = await makeAPIRequest(text, type)

  await handleAPIResponse(resp)
}

function addCloseSecondaryChatClickListener() {
  const closeIcon = secondaryChatbotContainer.querySelector(".close-chat")

  closeIcon.addEventListener("click", handleCloseSecondaryChat)

}

function addInputFocusListener() {
  const mainBotInput = document.querySelector(".chat-input-wrap input")
  const secondaryChatInput = document.querySelector(".secondary-chatbot-wrapper input");

  [mainBotInput, secondaryChatInput].forEach(input => {
    input.addEventListener("focus", () => {
      input.parentNode.style.borderColor = "#1553F0";
      input.parentElement.querySelector("svg path").style.fill = "#1553F0"
    })

    input.addEventListener("blur", () => {
      input.parentNode.style.borderColor = "#DAE3E8";
      input.parentElement.querySelector("svg path").style.fill = "#666D80"
    })
  })

}


function handleCloseSecondaryChat() {
  secondaryChatbotContainer.classList.remove("is-open")

  isSecondaryChatClosed = true

  gsap.set(secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper"), {
    opacity : 0,
    top : window.innerWidth > 992 ? "-8px" : "0px"
  })

  
  gsap.set(secondaryChatbotContainer.querySelector(".input-wrapper"), {
    width : 225
  })
  gsap.to(secondaryChatbotContainer.querySelector(".chatbot-icon-wrapper"), {
    duration: 0.3,
    opacity: 1
  })

}

function appendUserInputToChatScreen(text) {
  const allChatsDiv = secondaryChatbotContainer.querySelector(".chats")

  const responseDiv = document.createElement("div")
  responseDiv.classList.add("chat-item")
  responseDiv.classList.add("question-box")
  responseDiv.innerHTML = `<h4 class='question-box-question'>${text}</h4>`

  allChatsDiv.append(responseDiv)
}


function generateGuid() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}


function saveToSessionStorage(container) {
    const chatItems = container.querySelectorAll(".chat-item");
  
    // Convert NodeList to an array for easier manipulation
    const chatItemsArray = Array.from(chatItems);
    
    // Define an array to store the HTML content of each chat item
    const chatItemsContent = [];
    
    // Loop through each chat item and store its HTML content
    chatItemsArray.forEach(chatItem => {
        chatItemsContent.push(chatItem.outerHTML);
    });
    
    // Convert the array of chat item HTML content to a JSON string
    const chatItemsJson = JSON.stringify(chatItemsContent);
    
    // Store the JSON string in session storage
    sessionStorage.setItem("bot-chats", chatItemsJson);
  }


  function addHideClass(element) {
    element.classList.add("hide")
  }


  function removeHideClass(element) {
    element.classList.remove("hide")
  }



  async function makeAPIRequest(text, type) {

    const API_ENDPOINT = `https://general-runtime.voiceflow.com/state/user/${UNIQUE_USER_ID}/interact`;
    const API_KEY = `VF.DM.65df5409684f33402629843c.CLK9k8XYwRxE7pbz`
  
    const action = type !== "text" ? {
      type: type,
      payload: {
        label: `${text}`
      }
    } : {
      type: "text",
      payload: `${text}`
    }
  
    
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        versionID: '65df5123b93dbe8b0c12a50c',
        projectID: '65df5123b93dbe8b0c12a50b',
        'content-type': 'application/json',
        Authorization: API_KEY
      },
      body: JSON.stringify({
        action,
        sessionID : UNIQUE_USER_ID,
        versionID: '65df5123b93dbe8b0c12a50c',
        projectID: '65df5123b93dbe8b0c12a50b',
  
        "config": {
          "tts": false,
          "stripSSML": true,
          "stopAll": true,
          "excludeTypes": [
            "block",
            "debug",
            "flow"
          ]
        }
  
        // state : {
        //   ...stateObject
        // }
  
  
      })
    };
  
    try {
      const resp = await fetch(API_ENDPOINT, options)
  
      const data = await resp.json()
  
      await makeTranscriptRequest()
      
      return {
        error: false,
        data
      }
    } catch (error) {
      console.log("ERROR Intreaction request ", error)
      return {
        error: true,
        message: error?.response?.data?.message || error.message
      }
  
    }
  
  }



  async function makeTranscriptRequest() {
    const url = 'https://api.voiceflow.com/v2/transcripts';
    const API_KEY = `VF.DM.65df5409684f33402629843c.CLK9k8XYwRxE7pbz`
    const options = {
      method : "PUT",
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: API_KEY
      },
      body : JSON.stringify(
        {
          sessionID : UNIQUE_USER_ID,
          versionID: '65df5123b93dbe8b0c12a50c',
          projectID: '65df5123b93dbe8b0c12a50b',
          timestamp : `${new Date().getTime()}`,
          platform : "webchat",
        }
      )
  
    }
  
    try {
      const resp = await fetch(url, options)
      const data = await resp.json()
      console.log({ transript : data });
  
    } catch (error) {
      console.log("Error making transcript request ", error );
    }
  
  }