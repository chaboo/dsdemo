'use strict';

const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const _ = require('lodash');

module.exports = async (data, context) => {
  console.log(data);

  const serviceUrl = "https://eprijava.tax.gov.me/TaxisPortal/TaxPayerCompanies/Details";
  const url = serviceUrl + '?PIB=' + data.companyId;

  var company;

  const headers = {
    'Accept': '*/*',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  }

  // IMPORTANT
  // https://github.com/nodejs/node/issues/9845
  // https://github.com/axios/axios/issues/1304
  const agent = new https.Agent({ ciphers: 'DES-CBC3-SHA' });

  await axios.get(url, { headers: headers, httpsAgent: agent })
    .then(response => {
      //handle success
      const html = response.data;
      const $ = cheerio.load(html);

      company = {
        // row 0
        companyId: $("tbody > tr").eq(0).find('.display').text(),
        companyName: $("tbody > tr").eq(1).find('.display').text(),
        companyAddress: $("tbody > tr").eq(2).find('.display').text(),
        businessSectorCode: $("tbody > tr").eq(3).find('.display').text().split(" - ")[0].trim(),
        businessSectorName: $("tbody > tr").eq(3).find('.display').text().split(" - ")[1].trim(),
        taxArea: $("tbody > tr").eq(5).find('.display').text(),
        companyRegistrationDate: $("tbody > tr").eq(6).find('.display').text(),
        companyRegistrationId: $("tbody > tr").eq(7).find('.display').text(),
        companyRegistrationInstitution: $("tbody > tr").eq(8).find('.display').text(),
        companyRegisteredForVat: $("tbody > tr").eq(10).find('.display').text(),
        companyVatRegistrationDate: $("tbody > tr").eq(11).find('.display').text(),
        companyVatRegistrationId: $("tbody > tr").eq(12).find('.display').text()
      }
    })
    .catch(response => {
      //handle error
      console.log("ERROR");
      console.log(response);
    });

  return company;
};
