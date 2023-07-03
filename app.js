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

// Function to scrape the data and return the links
async function scrapeData() {
  try {
    const url = "https://www.discudemy.com/all/1"; // Update the URL here
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const courseElements = $(".card-header");
    const links = [];

    // Concurrently scrape course links
    const coursePromises = courseElements.toArray().map(async (element) => {
      const page = $(element).attr("href");
      const courseResponse = await axios.get(page);
      const courseData = courseResponse.data;

      // Extract the desired data from courseData using Cheerio
      // For example, let's extract the title and the main data from the course link
      const coursePage = cheerio.load(courseData);
      const courseLink = coursePage(
        "body > div.ui.container.item-f > div > section > div:nth-child(5) > div > a"
      ).attr("href");

      const courseLinkResponse = await axios.get(courseLink);
      const courseLinkData = courseLinkResponse.data;

      // Extract the desired data from courseLinkData using Cheerio
      // For example, let's extract the title of the course
      const courseLinkPage = cheerio.load(courseLinkData);
      const link = courseLinkPage("#couponLink").attr("href");
      return link;
    });

    // Await all concurrent scraping requests
    const courseLinks = await Promise.all(coursePromises);
    for (const link of courseLinks) {
      if (link) {
        links.push(link);
      }
    }

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
