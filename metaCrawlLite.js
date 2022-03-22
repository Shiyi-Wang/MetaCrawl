const puppeteer = require("puppeteer");
const fs = require("fs");
const getPageUrl = (pg) =>
  `https://www.metacareers.com/jobs/?page=${pg}#search_result`;
const COUNT_LIMIT = 20;
let count = 0;
let startTs = Date.now();

let history = [];
let numOfKeywords = 0;

async function searchOnPage(page, pageNum) {
  await page.goto(getPageUrl(pageNum));
  //await page.screenshot({path: "test.png", fullPage: true})

  let results = [];
  const urls = await page.evaluate(() => {
    const allElements = document.querySelectorAll(
      "#search_result > div._8tk7 > a"
    );
    let urls = [];
    for (const ele of allElements) {
      urls.push(ele.href);
    }
    return urls;
  });

  for (const url of urls) {
    if (count >= COUNT_LIMIT) break;

    count += 1;
    const elapsedTs = (Date.now() - startTs) / 1000;
    console.log(
      `[Page ${pageNum}: ${count}/${COUNT_LIMIT}: ${(
        Math.round(elapsedTs * 1000) / 1000
      ).toFixed(3)}s elapsed, ${(
        Math.round((elapsedTs / count) * 1000) / 1000
      ).toFixed(3)}s/item, ${numOfKeywords} keywords detected] Scraping ${url}`
    );
    history.push([elapsedTs, count, numOfKeywords, url]);

    await page.goto(url);

    // location
    let locations = "";
    try {
      locations = await page.$eval(
        "#careersContentContainer > div > div._9ati > div > div > div._25w_._69fb._31bb._25w-._1icm._1ikx._1im1 > div._9atf > div > div > div._97fe._6hy- > div > span",
        (el) => el.innerText
      );
    } catch (ignored) {}

    try {
      await page.click("#showLocationsButton");
      locations = await page.$eval("#locations", (el) => el.textContent);
    } catch (ignored) {}

    const res = await page.evaluate(
      (locations, url) => {
        const title = document.querySelector(
          "#careersContentContainer > div > div._9ati > div > div > div._25w_._69fb._31bb._25w-._1icm._1ikx._1im1 > div._9atj > div._9atb > div._9ata._8ww0"
        );
        const job_description = document.querySelector(
          "#careersContentContainer > div > div._3gel._3gfe._3gef._3gee._8lfv._3-8p._8lfv._3-8p > div._25xa._69fb._31bb._3gek > div > div > div._8muv > div:nth-child(1) > div:nth-child(3) > div._h46._8lfy._8lfy > div > ul > div:nth-child(1) > li > div._38io._30jd._9aou > div > div"
        );
        const min_req = document.querySelector(
          "#careersContentContainer > div > div._3gel._3gfe._3gef._3gee._8lfv._3-8p._8lfv._3-8p > div._25xa._69fb._31bb._3gek > div > div > div._8muv > div:nth-child(1) > div:nth-child(4) > div._h46._8lfy._8lfy > div > ul > div:nth-child(1) > li > div._38io._30jd._9aou > div > div"
        );

        return {
          title: title ? title.innerText : "",
          locations,
          job_description: job_description ? job_description.innerText : "",
          min_req: min_req ? min_req.innerText : "",
          url,
        };
      },
      locations,
      url
    );

    if (res.title.includes("Engineer") || res.title.includes("Manager")) {
      numOfKeywords += 1;
    }

    results.push(res);
  }

  return [results];
}

async function start() {
  const browser = await puppeteer.launch({
    args: ["--incognito"],
  });
  const page = await browser.newPage();
  let results = [];
  let currentPageNum = 1;

  while (count < COUNT_LIMIT) {
    const [pageRes] = await searchOnPage(page, currentPageNum);
    results = results.concat(pageRes);
    currentPageNum += 1;
  }

  const csvHistory =
    "Timestamp,Count,NumKeywords,URL\n" +
    history.map((row) => row.join(",")).join("\n");

  fs.writeFileSync("metaCrawlLite_statistics.csv", csvHistory);
  fs.writeFileSync(
    "metaCrawlLite_archive.json",
    JSON.stringify(results, undefined, 2)
  );

  // await Promise.all([
  //   await page.click("#u_p_6_eu"),
  //   await page.waitForNavigation(),
  // ]);

  await browser.close();
}

start();
