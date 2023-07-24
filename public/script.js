// Get the button element
const exploreCoursesBtn = document.getElementById("exploreCoursesBtn");
const navCoursesButton = document.getElementById("navCourses");
const navCoursesButton2 = document.getElementById("navCourses2");

// Scroll to the Recent Courses section when the button is clicked
exploreCoursesBtn.addEventListener("click", () => {
  const recentCoursesSection = document.querySelector(".header");
  recentCoursesSection.scrollIntoView({ behavior: "smooth" });
});
navCoursesButton.addEventListener("click", () => {
  const recentCoursesSection = document.querySelector(".header");
  recentCoursesSection.scrollIntoView({ behavior: "smooth" });
});
navCoursesButton2.addEventListener("click", () => {
  const recentCoursesSection = document.querySelector(".header");
  recentCoursesSection.scrollIntoView({ behavior: "smooth" });
});

function toggleSearch() {
  const searchBox = document.querySelector(".search-box");
  searchBox.classList.toggle("show-search");
}

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
  var x = document.getElementById("myLinks");
  x.classList.toggle("shownav");
}

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

// JavaScript
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const contentDiv = document.getElementById("content");

searchButton.addEventListener("click", async () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    try {
      const response = await fetch(
        `/search?term=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      const searchResults = data.searchResults;

      if (searchResults.length === 0) {
        contentDiv.innerHTML = "<p>No results found.</p>";
      } else {
        // Display the search results in the existing content container
        contentDiv.innerHTML = ""; // Clear existing content

        searchResults.forEach((result) => {
          const linkElement = document.createElement("a");
          linkElement.href = `/course/${result.page}/${encodeURIComponent(
            result.h1
          )}`;

          // Create card div and its contents
          const cardDiv = document.createElement("div");
          cardDiv.classList.add(
            "card",
            "flex",
            "flex-col",
            "justify-between",
            "pb-6"
          );

          const imageElement = document.createElement("img");
          imageElement.src = result.image;
          imageElement.alt = "";

          const courseDetailsDiv = document.createElement("div");
          courseDetailsDiv.classList.add("courseDetails");

          const h4Element = document.createElement("h4");
          h4Element.textContent = result.h1;

          const pElement = document.createElement("p");
          pElement.textContent = result.desc;

          const buttonElement = document.createElement("button");
          buttonElement.classList.add("cardBtn", "ml-auto", "mr-auto");
          buttonElement.innerHTML = "<span>Preview This Course</span>";

          // Append elements to the card div
          courseDetailsDiv.appendChild(h4Element);
          courseDetailsDiv.appendChild(pElement);

          cardDiv.appendChild(imageElement);
          cardDiv.appendChild(courseDetailsDiv);
          cardDiv.appendChild(buttonElement);

          // Append card div to the link element
          linkElement.appendChild(cardDiv);

          // Append the link element to the content container
          contentDiv.appendChild(linkElement);
        });

        // Scroll to the search results
        contentDiv.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error(error);
      contentDiv.innerHTML =
        "<p>Error occurred while fetching search results.</p>";
    }
  }
});
