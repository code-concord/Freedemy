// Get the button element
const exploreCoursesBtn = document.getElementById("exploreCoursesBtn");

// Scroll to the Recent Courses section when the button is clicked
exploreCoursesBtn.addEventListener("click", () => {
  const recentCoursesSection = document.querySelector(".header");
  recentCoursesSection.scrollIntoView({ behavior: "smooth" });
});

// Function to check if an element is in the viewport
function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  var windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  var cardHeight = rect.height || element.offsetHeight;

  // Calculate the height threshold for the card to be considered in the viewport
  var threshold = cardHeight * 0.5;

  return rect.top >= -threshold && rect.bottom <= windowHeight + threshold;
}

// Function to handle the scroll event
function handleScrollAnimation() {
  var cards = document.querySelectorAll(".card");
  cards.forEach(function (card) {
    if (isElementInViewport(card)) {
      card.classList.add("animated");
    }
  });
}

// Add event listener to the scroll event
window.addEventListener("scroll", handleScrollAnimation);

// Trigger initial animation on page load
handleScrollAnimation();
