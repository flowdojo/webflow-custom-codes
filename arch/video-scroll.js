new ScrollyVideo({
  scrollyVideoContainer: "scrolly-video",
  src:
    "https://uploads-ssl.webflow.com/647454a443b893e54d676b42/6482eecd60f9ba2ad77444fa_Arch0%20Website%20Sec-2-transcode.mp4"
});

const options = {
  root: null, // Use the viewport as the root
  rootMargin: "0px", // No margin around the root
  threshold: 0.3 // 50% intersection ratio
};

const texts = document.querySelectorAll(".text");

// use intersection observer

// Create a new Intersection Observer instance
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // When the observed element is intersecting the viewport
      // Do something, such as adding a CSS class or triggering an action
      const targetClass = entry.target.classList[1];
      if (targetClass === "card-one") {
        texts[0].classList.add("active");
      } else {
        texts[0].classList.remove("active");
      }
      if (targetClass === "card-two") {
        texts[1].classList.add("active");
      } else {
        texts[1].classList.remove("active");
      }
      if (targetClass === "card-three") {
        texts[2].classList.add("active");
      } else {
        texts[2].classList.remove("active");
      }
      if (targetClass === "card-four") {
        texts[3].classList.add("active");
      } else {
        texts[3].classList.remove("active");
      }
    } else {
      // When the observed element is no longer intersecting the viewport
      // Do something, such as removing a CSS class or reversing the previous action
    }
  });
}, options);

// Get all elements with the class ".card"
const cards = document.querySelectorAll(".card");

// Loop through each card element and observe them
cards.forEach((card) => {
  observer.observe(card);
});

// the infinity sign video

const videoInfinity = document.querySelector("[fd-custom-code='video'] video");

videoInfinity.setAttribute("playsinline", true);
videoInfinity.setAttribute("muted", true);
videoInfinity.setAttribute("loop", true);
videoInfinity.setAttribute("autoplay", true);

videoInfinity.play();
