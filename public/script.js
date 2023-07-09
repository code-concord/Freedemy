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

// code for search
const search = async () => {
  const searchbox = document.getElementById("search-item").value;

  try {
    const response = await fetch(
      `/search?term=${encodeURIComponent(searchbox)}`
    );
    const data = await response.json();

    if (response.ok) {
      const { searchResults } = data;

      const storeitems = document.getElementById("content");
      storeitems.innerHTML = ""; // Clear previous content

      searchResults.forEach((link) => {
        const card = document.createElement("div");
        card.className = "card flex flex-col justify-between pb-6";

        const linkElement = document.createElement("a");
        linkElement.href = `/course/${link.page}/${link.h1}`;

        const img = document.createElement("img");
        img.src = link.image;
        linkElement.appendChild(img);

        const courseDetails = document.createElement("div");
        courseDetails.className = "courseDetails";

        const h4 = document.createElement("h4");
        h4.textContent = link.h1;
        courseDetails.appendChild(h4);

        const p = document.createElement("p");
        p.textContent = link.desc;
        courseDetails.appendChild(p);

        const button = document.createElement("button");
        button.className = "cardBtn ml-auto mr-auto";
        const span = document.createElement("span");
        span.textContent = "Preview This Course";
        button.appendChild(span);

        card.appendChild(linkElement);
        card.appendChild(courseDetails);
        card.appendChild(button);

        storeitems.appendChild(card);
      });

      // Scroll to the search results section
      const searchResultsSection = document.querySelector(".container");
      searchResultsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(data.error); // Log the error message to the console
    }
  } catch (error) {
    console.error(error);
  }
};