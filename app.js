const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const ejs = require("ejs");
const path = require("path");
const { scrapSingleCourse, scrapPage } = require("./scrape");

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
    let links = cache.get("links");
    let oldPage = cache.get("oldPage");
    // console.log(oldPage,page);
    if (!links || oldPage != page) {
      cache.set("oldPage",page);
      links = await scrapPage(page);
      cache.set("links", links, scrapeInterval);
    }

    // Render the EJS template with the links
    res.render("index", { links,page });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route handler for the course description page
app.get("/course/:h1", async (req, res) => {
  try {
    const h1 = req.params.h1;
    // Fetch the links from the cache or scrape them if not available
    let links = cache.get("links");
    if (!links) {
      links = await scrapPage(1);
      cache.set("links", links, scrapeInterval);
    }

    // Find the specific link based on the "h1" parameter
    const course = links.find((course) => course.h1 === h1);
    course.link = await scrapSingleCourse(course.courseLink);

    console.log(course);  
    if (course) {
      // Render the detailed course d escription page with the corresponding course data
      res.render("course", { course });
    } else {
      res.status(404).send("Course not found");
    }
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
