# MetaCrawl - A CS 4675 Project

## Introduction

This is a web scraper for [Meta Career jobs openings](https://www.metacareers.com/jobs) using Puppeteer.

> Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

## Getting Started

### Initialization

```sh
npm install puppeteer
```

> **Note**: You need [Node.js](https://nodejs.org/en/) installed first. 

### TA Grading Usage
You may run the Lite version which scrape 20 pages to check the functionality:
```sh
node metaCrawlLite
```
This should produce two files 
* **metaCrawlLite_statistics.csv** - This file records the statistics of the crawling process, including time elapsed, keyword, number of pages crawled, and URLs.
* **metaCrawlLite_archive.json** - This serves as the web archive that contains the keywords (title, job description, etc.).

### General Usage

If you want to run a Lite version (which I recommend):
```sh
node metaCrawlLite
```
If you want to run the complete version (which scrape 1000 pages in +50 minutes):
```sh
node metaCrawl
```
> **Note**: The code is essentially the same as metaCrawlLite. The only difference is how many pages to crawl.

If you want to see a standalone testing on a single page:
```sh
node singlePageEvaluator
```

## Documentation

* The comprehensive report can be found in the index directory as **Report on Meta Career Crawler with Puppeteer - Shiyi Wang**.
* Command Lines Screenshot, 2000+ links Web Archive, crawl statistics, statistical graphs, and webpage screenshots can be found under **Project Report** folder.



