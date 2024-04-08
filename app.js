const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const ejs = require("ejs");
const path = require("path");
const { scrapSingleCourse, scrapPage } = require("./scrape");
const {
  getRandomPropertyOfObject,
  getRandomNThingsFromArray,
} = require("./utils");

const app = express();
const cache = new NodeCache();
const scrapeInterval = 3600; // Cache expiration time in seconds
const scrapeIntervalMilliseconds = scrapeInterval * 1000; // Convert seconds to milliseconds

// Define an async function to fetch and cache data for all pages
async function cacheAllPages() {
  try {
    const totalPages = 20; // Adjust the total number of pages as needed
    const fetchPagePromises = [];

    for (let page = 1; page <= totalPages; page++) {
      fetchPagePromises.push(scrapPage(page));
    }

    const allLinksArray = await Promise.all(fetchPagePromises);

    // Create a single object to store all links for each page
    const allLinks = {};
    allLinksArray.forEach((links, index) => {
      allLinks[index + 1] = links;
    });

    // Cache all links with an expiration time (scrapeInterval) just like before
    cache.set("allLinks", allLinks, scrapeInterval);

    console.log("All pages cached successfully!");
  } catch (error) {
    console.error("Error caching all pages:", error);
  }
}

// Call the function to cache all pages initially
cacheAllPages();

// Schedule a task to cache all pages at regular intervals
setInterval(cacheAllPages, scrapeIntervalMilliseconds);

// Set up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Route handler for the homepage
app.get("/", async (req, res) => {
  try {
    var page = req.query.page || 1;
    // Fetch the links from the cache or scrape them if not available
    let allLinks = cache.get("allLinks") ?? {};

    var newLinks = [];
    if (page in allLinks) {
      newLinks = allLinks[page];
    } else {
      newLinks = await scrapPage(page);
      allLinks[page] = newLinks;
      cache.set("allLinks", allLinks, scrapeInterval);
    }
    currentLinks = newLinks;

    // Render the EJS template with the links
    res.render("index", { currentLinks, page });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route handler for the course description page
app.get("/course/:page/:h1", async (req, res) => {
  try {
    const h1 = req.params.h1;
    const page = req.params.page;
    // Fetch the links from the cache or scrape them if not available
    let allLinks = cache.get("allLinks") ?? {};

    if (page in allLinks) {
      var links = allLinks[page];
    } else {
      links = await scrapPage(page);
      allLinks[page] = links;
      cache.set("allLinks", allLinks, scrapeInterval);
    }

    // Find the specific link based on the "h1" parameter
    const course = links.find((course) => course.h1 === h1);
    course.link = await scrapSingleCourse(course.courseLink);

    var randomPage = getRandomPropertyOfObject(allLinks);
    var randomCourses = getRandomNThingsFromArray(allLinks[randomPage], 3);

    console.log(course);
    if (course) {
      // Render the detailed course description page with the corresponding course data
      res.render("course", { course, randomCourses, randomPage });
    } else {
      res.status(404).send("Course not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route handler for searchbox
app.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.term; // Get the search term from the query parameter

    // Fetch the links from the cache or scrape them if not available
    const allLinks = cache.get("allLinks") ?? {};

    const searchResults = [];
    // Iterate through each page's links and filter based on the search term
    Object.values(allLinks).forEach((pageLinks) => {
      const results = pageLinks.filter((link) =>
        link.h1.toLowerCase().includes(searchTerm.toLowerCase())
      );
      searchResults.push(...results);
    });

    // Send a JSON response with the matching links
    res.json({ searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
