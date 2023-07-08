const { default: axios } = require("axios");
const cheerio = require("cheerio");

async function scrapPage(page) {
    try {
        const url = `https://www.discudemy.com/all/${page}`; // Update the URL here
        const response = await axios.get(url);
        var $ = cheerio.load(response.data);
        const courseCards = $(".card").toArray();
        let htmlCourseCards = courseCards.map(card => $.html(card));

        var list = [];
        htmlCourseCards.forEach(card => {
            $ = cheerio.load(card);
            var courseLink = $(".card-header").attr('href');
            var h1 = $(".card-header").text();
            var image = $("amp-img").attr('src')?.replace('240x135', '480x270');
            var desc = $(".description").text().trim();
            var price = $("span:nth-child(2):first").text().trim().replace('->$0','');
            var c = { courseLink, h1, image, desc, price };
            if(h1.length > 0){
                list.push(c);   
            }

        });
        //   console.log(list);
        return list;

    } catch (e) {
        console.log(e)
    }
}


async function scrapSingleCourse(courseLink) {
    var courseLinkRemove = courseLink.split("/");
    courseLinkRemove[3] = 'go';
    courseLink = courseLinkRemove.join("/");

    const courseLinkResponse = await axios.get(courseLink);
    const courseLinkData = courseLinkResponse.data;
    const courseLinkPage = cheerio.load(courseLinkData);
    return courseLinkPage("#couponLink").attr("href");
}


module.exports = { scrapPage, scrapSingleCourse }