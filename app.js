const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const ejs = require("ejs");
const path = require("path");

const app = express();
const cache = new NodeCache();
const scrapeInterval = 3600; // Cache expiration time in seconds

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Route handler for the homepage
app.get("/", async (req, res) => {
  try {
    // Fetch the links from the cache or scrape them if not available
    let links = cache.get("links");
    if (!links) {
      links = await scrapeData();
      cache.set("links", links, scrapeInterval);
    }

    // Render the EJS template with the links
    res.render("index", { links });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route handler for the course description page
app.get("/course/:h1", async (req, res) => {
  const h1 = req.params.h1;
  // You can retrieve the detailed description for the corresponding course based on the "h1" parameter
  // Perform any necessary data retrieval or processing here

  // Render the detailed course description page
  res.render("course", { h1 }); // Assuming you have a "course.ejs" file for the detailed course description
});

// Function to scrape the data and return the links, H1 headings, and images
async function scrapeData() {
  try {
    const url = "https://www.discudemy.com/all/1"; // Update the URL here
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const courseElements = $(".card-header");
    const links = [];

    // Concurrently scrape course links, H1 headings, and images
    const coursePromises = courseElements.toArray().map(async (element) => {
      const page = $(element).attr("href");
      const courseResponse = await axios.get(page);
      const courseData = courseResponse.data;

      const coursePage = cheerio.load(courseData);
      const courseLink = coursePage(
        "body > div.ui.container.item-f > div > section > div:nth-child(5) > div > a"
      ).attr("href");

      const image = coursePage(
        "body > div.ui.container.item-f > div > section > div.ui.center.aligned.attached.segment > amp-img"
      ).attr("src"); // Update the image selector

      const h1 = coursePage("#description-text > h1").text();

      return { courseLink, h1, image };
    });

    // Await all concurrent scraping requests
    const courseData = await Promise.all(coursePromises);
    for (const { courseLink, h1, image } of courseData) {
      const courseLinkResponse = await axios.get(courseLink);
      const courseLinkData = courseLinkResponse.data;

      const courseLinkPage = cheerio.load(courseLinkData);
      const link = courseLinkPage("#couponLink").attr("href");

      if (link) {
        links.push({ link, h1, image });
      }
    }

    console.log("Scraped data:", links); // Log the scraped data

    console.log("Scraped data updated");
    return links;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
