const axios = require("axios");
const cheerio = require("cheerio");

const fetchProduct = async () => {
  // Define the start time.
  let startTime = Date.now();

  let proxyList = [
    "209.127.191.180:9279",
    "45.142.28.83:8094",
    "45.136.231.43:7099",
    "45.137.60.112:6640",
    "45.136.228.85:6140",
    "45.134.184.43:6079",
    "193.8.56.119:9183",
    "45.140.13.124:9137",
    "45.136.231.85:7141",
    "45.134.184.201:6237",
  ];

  try {
    const response = await axios({
      method: "get",
      url: "https://www.amazon.com/s?k=food",
      timeout: 300000,
    });

    const html = response.data;

    const $ = cheerio.load(html);

    const product = [];

    $("div.s-card-container.s-overflow-hidden.aok-relative").each(
      (_idx, el) => {
        const item = $(el);
        console.log("Index : ", _idx);
        // console.log(item);

        // Fetch the Title
        const title = item
          .find("span.a-size-base-plus.a-color-base.a-text-normal")
          .text();

        // Fetch the Image
        const image = item.find("img.s-image").attr("src");

        // Fetch the item's link
        const link = item.find("a.a-link-normal.a-text-normal").attr("href");

        // Fetch the reviews
        const reviews = item
          .find(
            "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small"
          )
          .children("span")
          .last()
          .attr("aria-label");

        // Fetch the stars
        const stars = item
          .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
          .attr("aria-label");

        // Fetch the price
        const price = item.find("span.a-offscreen").text();

        let element = {
          index: _idx,
          title,
          image,
          link: `https://amazon.com${link}`,
          price,
        };

        if (reviews) {
          element.reviews = reviews;
        }

        if (stars) {
          element.stars = stars;
        }
        product.push(element);
      }
    );

    // // Output the duration time.
    console.log("Time: ", (Date.now() - startTime) / 1000, "s");

    return product;
  } catch (error) {
    throw error;
  }
};

fetchProduct().then((product) => console.log(product));
