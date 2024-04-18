
let gsapAnim;


const botMovementControl = createBotIconMovement();
const counter = counterController()
const allQuestionsWrapper = document.querySelector(".all-questions-wrapper")
const mainChatWrapper = document.querySelector(".main-chat")

const reverseController = shouldReverseController()

const init = async () => {
	// set first question as active initially
	// setActiveClass([...allQuestionsWrapper.querySelectorAll(".question-box")][0])
	botMovementControl.start(); // To start the movement
	handleResize()
	handleMouseMovement()
	questionClickListener()

	addChatInputListener()

}


init()


function questionClickListener() {

	const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];
	allBoxes.forEach((box, index) => {
		box.querySelector(".try-now-button").addEventListener('click', () => {
			/**  */
			const otherQuestions = allBoxes.filter((_, i) => i !== index)
			const chatBoxTitle = allQuestionsWrapper.querySelector("h4")
			const elementsToHide = gsap.utils.toArray([chatBoxTitle, ...otherQuestions])
			botMovementControl.stop()

			gsap.to(elementsToHide, {
				opacity: 0,
				onComplete: () => {
					allQuestionsWrapper.style.display = "none"
					mainChatWrapper.style.display = "block"
					gsap.to(mainChatWrapper, {
						opacity : 1
					})
				}
			})
			/** Init Main Chat screen */

			initMainChatScreen(box)

		})
	})
}



function createBotIconMovement() {
	let intervalId; // Encapsulated within the closure

	const start = () => {

		const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];

		intervalId = setInterval(() => {

			/**
			 * if no active question is present, mark first one as active
			*/
			const activeQuestionIndex = getActiveQuestionIndex()
			if (activeQuestionIndex < 0) {
				setActiveClass(allBoxes[0])
			}

			const count = counter.getCount(); // gives the index of the next question (towards which the logo will move)
			// console.log({ count });
			const targetQuestionBox = allBoxes[count];


			const lastActiveQuestionIndex = getActiveQuestionIndex()

			// animate the logo
			gsapAnim = animateBotLogo(targetQuestionBox, lastActiveQuestionIndex)

			allBoxes.forEach(removeActiveClass);

			setActiveClass(targetQuestionBox);

			let newShouldReverse = updateShouldReverse(count, allBoxes.length, reverseController.get());
			reverseController.update(newShouldReverse)
			const newCount = getNewCountValue(count, reverseController.get());

			counter.updateCount(newCount)

		}, 2000);
	};

	const stop = () => {

		clearInterval(intervalId);
		if (gsapAnim) {
			gsapAnim.kill()
			gsapAnim.invalidate()
		}

		// const botIcon = document.querySelector(".chatbot-icon");
		// gsapAnim = gsap.to(botIcon, {

		// })
	};

	return { start, stop };
}

function handleResize() {
	window.addEventListener('resize', repositionBotLogo)
}


/*********** */

function animateBotLogo(targetQuestionBox, lastActiveQuestionIndex) {

	const botIcon = allQuestionsWrapper.querySelector(".chatbot-icon");

	// the target top and left position
	const { top, left } = getPositionOfElement(targetQuestionBox);


	const isMovingTowardsLeft = isMovingLeft(lastActiveQuestionIndex, counter.getCount())
	// console.log({ isMovingTowardsLeft });


	const isMovingUp = getIsMovingUp(lastActiveQuestionIndex, counter.getCount())


	const tempTop = isMovingUp ? top - 60 : top - 45
	const rotateZ = isMovingTowardsLeft ? -360 : 360
	// const rotateZ = 360

	const tl = gsap.timeline()
	tl.set(botIcon, { rotateZ: 0 })
	tl.to(botIcon, {
		left: left - 40,
		rotateZ,
		duration: 0.5,
	}, "0")
	tl.to(botIcon, {
		top: tempTop,
		// ease : CustomEase.create("custom", "M0,0 C0.364,0.647 0.516,3, 1, 0.989 "),
		// rotateZ : 360,
	}, "0")
		.to(botIcon, {
			y: isMovingUp ? 0 : -20,
			top: top + (targetQuestionBox.offsetHeight / 2) - 30,
			ease: "Bounce.easeOut"
		}, "0.3")
	// .to(botIcon, {
	// 	y : isMovingUp ? 0 : -20,
	// 	ease : Bounce.easeOut
	// }, "0.6")
	// top: top + (targetQuestionBox.offsetHeight / 2) - 20,
	// CustomEase.create("custom", "M0,0 C0.364,0.647 0.505,1.81 1,1 ")
	return tl
}

function handleMouseMovement() {

	const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];

	allBoxes.forEach((questionBox, index) => {
		questionBox.addEventListener('mouseenter', () => {
			botMovementControl.stop()

			const newCount = getNewCountValue(index, reverseController.get())
			counter.updateCount(newCount)

			// if hovered on already active element, we do nothing
			if (questionBox.classList.contains("active")) return

			let count = counter.getCount()
			console.log({ count });

			/**
			 * If hovered directly on the last question on page, load, 
			 * then, we need to set reverse to true
			*/
			const currentReverseValue = reverseController.get()
			if (index === 4 && !currentReverseValue) {
				count = 3
				reverseController.update(true)
			}
			if (index === 0) {
				count = 1
				reverseController.update(false)

			}

			counter.updateCount(count)

			const activeQuestionIndex = getActiveQuestionIndex()
			if (activeQuestionIndex < 0) {
				setActiveClass(allBoxes[0])
			}

			const lastActiveQuestionIndex = getActiveQuestionIndex()


			animateBotLogo(questionBox, lastActiveQuestionIndex)
			allBoxes.forEach(removeActiveClass)
			setActiveClass(questionBox)
		})

		questionBox.addEventListener('mouseleave', () => {

			if (gsapAnim) {
				gsapAnim.invalidate()
				gsapAnim.kill()
			}

			console.log("mouse left");
			botMovementControl.stop()

			botMovementControl.start()

		})

	})
}

function repositionBotLogo() {
	const botIcon = allQuestionsWrapper.querySelector(".chatbot-icon")
	const currentActiveQuestionBox = allQuestionsWrapper.querySelector(".question-box.active")
	const { left } = getPositionOfElement(currentActiveQuestionBox)

	botIcon.style.left = `${left - 40}px`
	// botIcon.style.top = `${top + (currentActiveQuestionBox.offsetHeight / 2) - 20}px`
}


function counterController() {
	let count = 0;

	const getCount = () => {
		return count
	}
	const updateCount = (newCount) => {
		count = newCount
	}

	return {
		getCount,
		updateCount
	}
}

 function addMainChatCloseListener() {
	const closeIcon = mainChatWrapper.querySelector(".close-main-chat")

	console.log({ closeIcon });

	closeIcon.addEventListener("click", handleCloseChat)
}

 function removeMainChatCloseListener() {
	const closeIcon = mainChatWrapper.querySelector(".close-main-chat")

	console.log({ closeIcon });

	closeIcon.removeEventListener("click", handleCloseChat)
}




function handleCloseChat() {
	const allQuestions = allQuestionsWrapper.querySelectorAll(".question-box")
	const chatBoxTitle = allQuestionsWrapper.querySelector("h4")
	const elementsToShow = gsap.utils.toArray([...allQuestions, chatBoxTitle, allQuestionsWrapper])



	gsap.to(mainChatWrapper, {
		opacity: 0,
		onComplete: () => {

			/** delete existing chats and hide the choices */
			const existingChatItems = mainChatWrapper.querySelectorAll(".chat-item")

			console.log({ existingChatItems });
			existingChatItems.forEach(item => {
				if (item.classList.contains("first-question")) return
				item.remove()
			})

			addHideClass(mainChatWrapper.querySelector(".suggestions-and-input"))

			mainChatWrapper.style.display = "none"
			allQuestionsWrapper.style.display = "block"
			gsap.fromTo(elementsToShow, {
				opacity: 0
			}, {
				opacity: 1
			})

			
		}
	})
}

/** 
 * Main Chat Screen
 */


 async function initMainChatScreen(lastClickedQuestion) {

  
  const { left, top, right } = getPositionOfElement(lastClickedQuestion)

  const firstQuestion = mainChatWrapper.querySelector(".first-question")

  const questionText = lastClickedQuestion.querySelector('h4').innerText

  firstQuestion.querySelector("h4").innerText = `${questionText}`;

  gsap.fromTo(firstQuestion, {
    top,
    right
  }, {
    top: 0,
    right: 0,
    duration: 1.2,
    ease: "sine.inOut",
    onComplete : async () => {

      await makeAPIRequestAndShowResult(questionText)

    }
  })


}


 async function makeAPIRequestAndShowResult(text) {
  await setBotPositionAndShowLoader()
  addHideClass(mainChatWrapper.querySelector(".choices"))
  const { error, data, message } = await makeAPIRequest(text)
  if (error) {
    handleError(message)
  } else {
    const { textToShow, choices } = extractDataFromResponse(data)
    await hideLoader()
    renderSuccessOutput(textToShow)
    await renderChoices(choices)
    addClickListenerToChoices()

  }

}




function renderSuccessOutput(text) {
  const scrollValue = getTopValueForBot()

  mainChatWrapper.querySelector(".chat-wrapper .chats").innerHTML += `<div class="chat-item response-box">
    <p>${text}</p>
  </div>`

  removeMainChatCloseListener()
  addMainChatCloseListener()


  scrollChatPartially(scrollValue)

}


function renderChoices(choices) {
  return new Promise(resolve => {
    const choicesDiv = mainChatWrapper.querySelector(".choices")

    addHideClass(choicesDiv);

    choicesDiv.innerHTML = ""

    if (choices && choices.length) {
      choices.forEach(choice => {
        choicesDiv.innerHTML += `<span class="choice">${choice}</span>`
      })
    }
    removeHideClass(choicesDiv);
    removeHideClass(mainChatWrapper.querySelector(".suggestions-and-input"))
    showChoicesAndInputBox()
    resolve()
  })

}

 function addChatInputListener() {
  const inputElement = mainChatWrapper.querySelector(".chat-input")

  const handleSubmitEvent = async (userInput) => {
    hideChoicesAndInput()
    await addUserInputToChatScreen(userInput)
    await makeAPIRequestAndShowResult(userInput)
  }


  inputElement.addEventListener("keypress", async function (e) {
    const keyPressed = (e.keyCode ? e.keyCode : e.which)

    if (keyPressed === 13) {
      const inputTextValue = inputElement.value
      if (!inputTextValue) return
      await handleSubmitEvent(inputTextValue)
      inputElement.value = ""
    }


  })

  const inputArrowSubmitBtn = mainChatWrapper.querySelector(".chat-input-wrap img")
  inputArrowSubmitBtn.addEventListener("click", async function() {
    const inputTextValue = inputElement.value
    if (!inputTextValue) return
    await handleSubmitEvent(inputTextValue)
    inputElement.value = ""
  })

}

function addClickListenerToChoices() {
  const choices = document.querySelectorAll(".choices .choice")
  choices.forEach(choice => choice.addEventListener("click", async function () {

    const choiceText = choice.innerText;

    hideChoicesAndInput()
    await addUserInputToChatScreen(choiceText)
    await makeAPIRequestAndShowResult(choiceText)
  }))
}

function showChoicesAndInputBox() {
  const allChoices = mainChatWrapper.querySelectorAll(".choices .choice")
  const chatInput = mainChatWrapper.querySelector(".chat-input-wrap")

  console.log({ allChoices, chatInput });
  removeHideClass(chatInput)
  const elementsToShow = gsap.utils.toArray([allChoices, chatInput])
  gsap.fromTo(elementsToShow, {
    opacity: 0,
    y: 10
  }, {
    opacity: 1,
    y: 0,
    stagger: 0.1,
  })
}


async function addUserInputToChatScreen(userInputText) {

  console.log("started ");
  const chats = mainChatWrapper.querySelector(".chats")

  const elementToAdd = `<div class="chat-item question-box user-input">
    <h4 class="question-box-question">${userInputText}</h4>
  </div>`
  chats.innerHTML += elementToAdd

  const lastChatElement = getLastChatItem()

  scrollToChatEnding()
  await revealUserInput(lastChatElement)

  console.log("coomplete ");
}



function setBotPositionAndShowLoader() {

  return new Promise(resolve => {

    showLoader()
    const bot = mainChatWrapper.querySelector(".chatbot-icon-wrapper")

    const currentHeight = getTopValueForBot()

    gsap.to(bot, {
      top: currentHeight,
      ease: "ease",
      onComplete: resolve
    })
  })

}


function hideChoicesAndInput() {
  const allChoices = mainChatWrapper.querySelectorAll(".choices .choice")
  const chatInput = mainChatWrapper.querySelector(".chat-input-wrap")

  addHideClass(chatInput)
  const elementsToShow = gsap.utils.toArray([allChoices, chatInput])
  gsap.to(elementsToShow, {
    opacity: 0,
    y: 10
  })
}


function revealUserInput(element) {
  return new Promise(resolve => {
    gsap.fromTo(element, {
      opacity: 0,
      y: 15
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      // delay : 0.4,
      onComplete: resolve
    })
  })
}


 function addHideClass(element) {
  element.classList.add("hide")
}
 function removeHideClass(element) {
  element.classList.remove("hide")
}


function scrollToChatEnding() {
  const chatScreen = mainChatWrapper.querySelector(".chats")

  const val = getTopValueForBot()
  chatScreen.scrollTo({
    top: val,
    behavior: "smooth",
  })
}


function scrollChatPartially(value) {
  const chatScreen = mainChatWrapper.querySelector(".chats")
  chatScreen.scrollTo({
    top: value,
    behavior: "smooth",
  })
}

function hideLoader() {
  return new Promise(resolve => {
    const botLoader = mainChatWrapper.querySelector(".chats .chatbot-icon-wrapper").querySelector(".bot-loader")
    console.log({ botLoader });

    gsap.to(botLoader, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        botLoader.style.display = "none"
        resolve()
      }
    })
  })

}

function showLoader() {
  // return new Promise(resolve => {
  //   botLoader.style.display = "block"
  //   const botLoader = mainChatWrapper.querySelector(".chats .chatbot-icon-wrapper").querySelector(".bot-loader")
  //   console.log({ botLoader });

  //   gsap.to(botLoader, {
  //     opacity: 1,
  //     duration: 0.2,
  //     onComplete: () => {
  //       resolve()
  //     }
  //   })
  // })

  const botLoader = mainChatWrapper.querySelector(".chats .chatbot-icon-wrapper").querySelector(".bot-loader")
  botLoader.style.display = "block"
  console.log({ botLoader });

  gsap.to(botLoader, {
    opacity: 1,
    duration: 0.2,
  })

}


function getTopValueForBot() {
  let totalHeight = 0;
  const allChatItems = mainChatWrapper.querySelectorAll(".chat-item")

  console.log({ allChatItems });
  console.log({ allChatItems });
  allChatItems.forEach(item => {
    console.log("item height ", item.offsetHeight);
    totalHeight += item.offsetHeight + 30
  })
  return totalHeight - allChatItems.length * 5 + 20
}


function handleError(errMessage) {
  console.error({ error: errMessage });
}

async function makeAPIRequest(text) {

  const API_ENDPOINT = `https://general-runtime.voiceflow.com/state/user/userID/interact?logs=off`;

  const API_KEY = `VF.DM.65df5409684f33402629843c.CLK9k8XYwRxE7pbz`
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      versionID: 'development',
      'content-type': 'application/json',
      Authorization: API_KEY
    },
    body: JSON.stringify({
      action: { type: 'text', payload: `${text}` },
      config: {
        tts: false,
        stripSSML: true,
        stopAll: true,
        excludeTypes: ['block', 'debug', 'flow']
      }
    })
  };

  try {
    const resp = await fetch(API_ENDPOINT, options)

    const data = await resp.json()

    return {
      error: false,
      data
    }
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.message || error.message
    }

  }

}


function getLastChatItem() {
  const allChatItems = [...mainChatWrapper.querySelectorAll(".chat-wrapper .chats>div.chat-item")]
  return allChatItems[allChatItems.length - 1]

}

function extractDataFromResponse(data) {
  const textToShow = data.find(item => item.type === "text").payload.message
  const choices = data.find(item => item.type === "choice")?.payload?.buttons?.map(btn => btn.name)

  return {
    textToShow,
    choices
  }
}



/**
 * UTILS
 */

 function getPositionOfElement(element, container) {
  const containerRect = container ?? document.querySelector(".chat-screen-wrapper").getBoundingClientRect()
  const { top, bottom, left, right } = element.getBoundingClientRect()
  // console.log({ top, bottom, left, right });
  // console.log({ top : containerRect.top, bottom : containerRect.bottom, left : containerRect.left, right : containerRect.right });
  return {
      top: Math.abs(top - containerRect.top),
      bottom: Math.abs(bottom - containerRect.bottom),
      left: Math.abs(left - containerRect.left),
      right: Math.abs(right - containerRect.right)
  }
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
  if (shouldReverse)
      return count - 1
  else
      return count + 1
}

 function removeActiveClass(element) {
  element.classList.remove("active")
}

 function setActiveClass(element) {
  element.classList.add("active")
}

 function getActiveQuestionIndex() {
  const allQuestionsWrapper = document.querySelector(".all-questions-wrapper")
  const allQuestions = [...allQuestionsWrapper.querySelectorAll(".question-box")];

  return allQuestions.findIndex(el => el.classList.contains("active"))
}

 function lastActiveQuestionTracker() {
  let index = 0;
  const setIndex = (newIndex) => {
      index = newIndex
  }

  const getIndex = () => {
      return index
  }

  return {
      setIndex,
      getIndex
  }
}

 function shouldReverseController() {
  let shouldReverse = false

  const update = (value) => {
      shouldReverse = value
  }

  const get = () => {
      return shouldReverse
  }

  return  {
      update,
      get
  }
}

 function getIsMovingUp(lastIndex, targetIndex) {
  return targetIndex < lastIndex
}

 function isMovingLeft(lastElementIndex, targetElementIndex) {
  const allBoxes = [...allQuestionsWrapper.querySelectorAll(".question-box")];

  const { left : lastElementLeftValue } = getPositionOfElement(allBoxes[lastElementIndex])
  const { left : targetElementLeftValue } = getPositionOfElement(allBoxes[targetElementIndex])

  return targetElementLeftValue < lastElementLeftValue
  
}
