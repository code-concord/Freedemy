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
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
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
