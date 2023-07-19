const { default: axios } = require("axios");
const cheerio = require("cheerio");

async function scrapPage(page) {
  try {
    const url = `https://www.discudemy.com/all/${page}`; // Update the URL here
    console.log("Fetching data from URL:", url);

    const response = await axios.get(url);
    console.log("Received response from URL:", url);

    var $ = cheerio.load(response.data);
    const courseCards = $(".card").toArray();
    console.log("Found", courseCards.length, "course cards on the page");

    let htmlCourseCards = courseCards.map((card) => $.html(card));
    console.log("Converted course cards to HTML strings");

    var list = [];
    htmlCourseCards.forEach((card) => {
      $ = cheerio.load(card);
      var courseLink = $(".card-header").attr("href");
      var h1 = $(".card-header").text();
      var image = $("amp-img").attr("src")?.replace("240x135", "480x270");
      var desc = $(".description").text().trim();
      var price = $("span:nth-child(2):first")
        .text()
        .trim()
        .replace("->$0", "");
      var c = { courseLink, h1, image, desc, price };
      if (h1.length > 0) {
        list.push(c);
      }
    });

    console.log("Extracted information for", list.length, "courses");
    return list;
  } catch (e) {
    console.log("Error occurred during scraping:", e);
  }
}

async function scrapSingleCourse(courseLink) {
  var courseLinkRemove = courseLink.split("/");
  courseLinkRemove[3] = "go";
  courseLink = courseLinkRemove.join("/");
  console.log("Modified courseLink:", courseLink);

  const courseLinkResponse = await axios.get(courseLink);
  console.log("Received response from courseLink:", courseLink);

  const courseLinkData = courseLinkResponse.data;
  const courseLinkPage = cheerio.load(courseLinkData);
  const couponLink = courseLinkPage("#couponLink").attr("href");
  console.log("Extracted couponLink:", couponLink);

  return couponLink;
}

module.exports = { scrapPage, scrapSingleCourse };
