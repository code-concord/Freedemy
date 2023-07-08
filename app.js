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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Route handler for the homepage
app.get("/", async (req, res) => {
  try {
    var page = req.query.page || 1;
    // Fetch the links from the cache or scrape them if not available
    let allLinks = cache.get("allLinks") ?? {};
    // console.log(oldPage,page);

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
      // Render the detailed course d escription page with the corresponding course data
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

    // Iterate over all the pages and search for the term in each page's links
    Object.values(allLinks).forEach((pageLinks) => {
      const results = pageLinks.filter((link) =>
        link.h1.toLowerCase().includes(searchTerm.toLowerCase())
      );
      searchResults.push(...results);
    });

    console.log(searchResults); // Print the searchResults to the console

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
