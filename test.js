var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  api_key: "6wncPRGLI4NPUsnzwkNGeTJ0RJ23",
  monetization: true,
  destination: "https://www.sih.gov.in/",
  ad_page: 2,
  category: "Education",
  tags: [
    "trendinglinks",
    "udemy",
    "courses",
    "technology",
    "coding",
    "programming",
  ],
  monetize_with_money: false,
  price: 0,
  currency: "INR",
  purchase_note: "",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("https://api.shareus.io/generate_link", requestOptions)
  .then((response) => response.json()) // Parse the response as JSON
  .then((data) => {
    if (data && data.status === "success" && data.link) {
      console.log(data.link); // Log the "link" value only
    } else {
      console.log("Unable to retrieve shortened link.");
    }
  })
  .catch((error) => console.log("Error:", error));
