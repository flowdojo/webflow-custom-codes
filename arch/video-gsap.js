gsap.registerPlugin(ScrollTrigger);

// initialize lenis
const lenis = new Lenis();

lenis.on("scroll", (e) => {
  ScrollTrigger.update;
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const videoWrapper = document.querySelector(".video-scroll-section");
const video = document.querySelector(".video-scroll-section video");

console.log("video ", video);
video.pause();
video.currentTime = 0;

// Create a timeline for the video animation
const videoTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: videoWrapper,
    pin: true,
    scrub: 1,
    end: "+=3500"
  }
});

// Define the animation for the video
videoTimeline.to(video, { currentTime: video.duration, ease: "none" });
