const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const url = "https://www.metacareers.com/v2/jobs/651492202876559/";

async function start() {
  const browser = await puppeteer.launch({
    args: ["--incognito"],
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: "single page test segment.png" });

  let locations = "";
  try {
    locations = await page.$eval(
      "#careersContentContainer > div > div._9ati > div > div > div._25w_._69fb._31bb._25w-._1icm._1ikx._1im1 > div._9atf > div > div > div._97fe._6hy- > div > span",
      (el) => el.textContent
    );
  } catch (ignored) {}

  try {
    await page.click("#showLocationsButton");
    locations = await page.$eval("#locations", (el) => el.textContent);
  } catch (ignored) {}

  const job = await page.evaluate((locations, url) => {
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
      tittitle: title ? title.innerText : "",
      locations,
      job_description: job_description ? job_description.innerText : "",
      min_req: min_req ? min_req.innerText : "",
      url,
    };
  }, locations, url);

  console.log(job);
  await browser.close();
}

start();
