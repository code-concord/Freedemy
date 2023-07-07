// Function to scrape the data and return the links, H1 headings, and images
async function scrapeData() {
    try {
      const url = "https://www.discudemy.com/all/1"; // Update the URL here
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const courseElements = $(".card-header");
      const links = [];
  
      // Concurrently scrape course links, H1 headings, and images with limited concurrency
      const coursePromises = courseElements.toArray().map(async (element) => {
        const page = $(element).attr("href");
        const courseResponse = await axios.get(page);
        const courseData = courseResponse.data;
  
        const coursePage = cheerio.load(courseData);
        const courseLink = coursePage(
          'body > div[class^="ui container"] > div > section > div:nth-child(5) > div > a'
        ).attr("href");
  
        const image = coursePage(
          'body > div[class^="ui container"] > div > section > div.ui.center.aligned.attached.segment > amp-img'
        ).attr("src"); // Update the image selector
  
        const h1 = coursePage("#description-text > h1").text();
  
        const desc = coursePage("div.ui.attached.segment")
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim();
  
        const price = coursePage(
          "body > div.ui.container.item-f > div > section > div:nth-child(4) > p:nth-child(4) > span"
        ).text();
  
        return { courseLink, h1, image, desc, price };
      });
  
      // Limit concurrency using Promise.all with a concurrency limit of 5
      const concurrencyLimit = 5;
      const courseData = [];
      for (let i = 0; i < coursePromises.length; i += concurrencyLimit) {
        const batch = coursePromises.slice(i, i + concurrencyLimit);
        const batchResult = await Promise.all(batch);
        courseData.push(...batchResult);
      }
  
      // Process the course links to fetch the final data
      for (const { courseLink, h1, image, desc, price } of courseData) {
        const courseLinkResponse = await axios.get(courseLink);
        const courseLinkData = courseLinkResponse.data;
  
        const courseLinkPage = cheerio.load(courseLinkData);
        const link = courseLinkPage("#couponLink").attr("href");
  
        if (link) {
          links.push({ link, h1, image, desc, price });
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