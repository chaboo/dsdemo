'use strict';

const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const puppeteer = require('puppeteer-core');
const { getChrome } = require('./chrome-script');
const _ = require('lodash');

const fetchBasicDetails = ($) => {
  const attributeMap = {
    "Registarski broj": "companyRegistrationId",
    "PIB": "companyId",
    "Broj promjene": "companyRegistrationChangeId",
    "Puni naziv": "companyName",
    "Skraćeni naziv": "companyShortName",
    "Oblik organizovanja": "companyType",
    "Šifra djelatnosti": "businessSectorCode",
    "Naziv djelatnosti": "businessSectorName",
    "Adresa sjedišta": "companyHeadquartersAddressStreet",
    "Mjesto sjedišta": "companyHeadquartersAddressCity",
    "Adresa prijema službene pošte": "companyPostDeliveryAddressStreet",
    "Mjesto prijema službene pošte": "companyPostDeliveryAddressCity",
    "Ukupan kapital": "companyTotalCapital",
    "Datum registracije": "companyRegistrationDate",
    "Datum promjene": "companyRegistrationChangeDate",
    "Status": "companyStatus"
  }

  const data = $("#osnovniPodaci tr").slice(1, -1).map(function(i, el) {
                const attribute = $(el).find('td').eq(0).text().trim().replace(":", "");

                if (attribute !== "") {
                  return {
                    key: attributeMap[attribute] || "unknown",
                    value: $(el).find('td').eq(1).text().trim(),
                    attribute: attribute
                  }
                }

                return null;
              }).get();
  return data;
}

const fetchCompanyOfficials = ($) => {
  const roleMap = {
    "Osnivač": "founder",
    "Ovlašćeni zastupnik": "representative",
    "Izvršni direktor": "ceo",
    "Član Odbora direktora": "board-member",
    "Predsjednik Odbora direktora": "board-president"
  }

  const data = $("#licaUDruštvu tbody tr").map(function(i, el) {
                  return {
                    firstName: $(el).find('td').eq(0).text(),
                    lastName: $(el).find('td').eq(1).text(),
                    role: {
                      attribute: $(el).find('td').eq(2).text(),
                      key: roleMap[$(el).find('td').eq(2).text()] || "unknown"
                    },
                    responsibility: $(el).find('td').eq(3).text(),
                    equity: $(el).find('td').eq(4).text()
                  }
                }).get();
  return data;
}

const fetchCompanySearchResultData = ($) => {
  return {
    companyRegistrationId: $("tr.odd td").eq(1).text(),
    companyId: $("tr.odd td").eq(2).text(),
    companyType: $("tr.odd td").eq(3).text(),
    companyName: $("tr.odd td").eq(4).text(),
    businessSectorName: $("tr.odd td").eq(5).text(),
    businessSectorCode: $("tr.odd td").eq(6).text(),
    companyHeadquartersPlace: $("tr.odd td").eq(7).text(),
    companyStatus: $("tr.odd td").eq(8).text()
  }
}

module.exports = async (data, context) => {
  const url = "http://www.pretraga.crps.me:8083/Home/Pretraga"

  const chrome = await getChrome();
  console.log("chrome arrived");
  const browser = await puppeteer.connect({browserWSEndpoint: chrome.endpoint});
  const page = await browser.newPage();
  console.log("new page");
  // go to search page, fill form and submit search form
  await page.goto(url);
  console.log("navigated to url");
  // let contenttest = await page.evaluate(() => document.body.innerHTML);
  // console.log(contenttest);

  // await page.evaluate(() => document.getElementById("PIB_brzo").value = "");
  // console.log("PIB_brzo");

  await page.type('#PIB_brzo', data.companyId);
  console.log("Enter PIB");

  await page.click('#submit');
  console.log("submitted search");

  // parse search results page
  await page.waitForNavigation();
  let element = await page.$("tr.odd");
  let content = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(content);

  const companySearchResult = fetchCompanySearchResultData($);
  console.log(companySearchResult);

  // go to search result detail page

  // How to handle new tab
  // https://github.com/GoogleChrome/puppeteer/issues/3718#issuecomment-451325093
  const pageTarget = page.target();
  // How to click a link
  // https://stackoverflow.com/a/51016928/10271244
  await page.$eval('td.sorting_1 > a', el => el.click());
  const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
  const newPage = await newTarget.page();
  element = await newPage.$("#tblLicaUDrustvu tr.odd");
  content = await newPage.evaluate(() => document.body.innerHTML);
  $ = cheerio.load(content);

  // parse search result detail page
  const basicDetails = fetchBasicDetails($);
  const company = {};

  console.log("Basic Details");
  console.log(basicDetails);

  basicDetails.forEach(function(elem) {
    company[elem.key] = elem.value;
  });

  const companyOfficials = fetchCompanyOfficials($);

  // const company = { companySearchResult, companyBasicDetails, companyOfficials};

  await browser.close();
  console.log('CRPS: ');
  console.log(company);

  return company;
};
