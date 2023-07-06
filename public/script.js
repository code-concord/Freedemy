// Get the button element
const exploreCoursesBtn = document.getElementById("exploreCoursesBtn");
const navCoursesButton = document.getElementById("navCourses");

// Scroll to the Recent Courses section when the button is clicked
exploreCoursesBtn.addEventListener("click", () => {
  const recentCoursesSection = document.querySelector(".header");
  recentCoursesSection.scrollIntoView({ behavior: "smooth" });
});
navCoursesButton.addEventListener("click", () => {
  const recentCoursesSection = document.querySelector(".header");
  recentCoursesSection.scrollIntoView({ behavior: "smooth" });
});

// Function to check if an element is in the viewport
function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  var windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top <= windowHeight && rect.bottom >= 0;
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
window.addEventListener("load", handleScrollAnimation);
