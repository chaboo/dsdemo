'use strict';

const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const _ = require('lodash');

module.exports = async (data, context) => {
  const serviceUrl = "https://eprijava.tax.gov.me/TaxisPortal/FinancialStatement/Details";
  const url = serviceUrl + '?rbr=' + data.statementId;

  var statement;

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

      statement = {
        // row 0
        statementYear: $(".FinStateTable tr").eq(0).find('td').eq(0).find('span').text(),
        statementFromDate: $(".FinStateTable tr").eq(0).find('td').eq(1).find('span').text(),
        statementToDate: $(".FinStateTable tr").eq(0).find('td').eq(2).find('span').text(),
        statementId: $(".FinStateTable tr").eq(0).find('td').eq(3).contents().last().text().trim(),

        // row 1
        companyName: $(".FinStateTable tr").eq(1).find($('.display')).text(),
        // row 2
        companyLocation: $(".FinStateTable tr").eq(2).find($('.display')).text(),

        // row 4
        businessSectorCode: $(".FinStateTable tr").eq(4).find('td').eq(0).find('span').text(),
        companyId: $(".FinStateTable tr").eq(4).find('td').eq(1).find('span').text(),
        changeType: $(".FinStateTable tr").eq(4).find('td').eq(2).find('strong').text(),
        consolidatedStatement: $(".FinStateTable tr").eq(4).find('td').eq(3).find('span').text().trim(),

        // row 5
        statementAuthorName: $(".FinStateTable tr").eq(5).find('td').eq(0).find('span').text(),
        statementAuthorUnid: $(".FinStateTable tr").eq(5).find('td').eq(1).contents().last().text().trim(),
        statementAuthorEmail: $(".FinStateTable tr").eq(5).find('td').eq(2).contents().last().text().trim(),

        // row 6
        companyOfficialFirstName: $(".FinStateTable tr").eq(6).find('td').eq(0).find('span').text(),
        companyOfficialLastName: $(".FinStateTable tr").eq(6).find('td').eq(1).find('span').text(),
        companyOfficialUnid: $(".FinStateTable tr").eq(6).find('td').eq(2).contents().last().text().trim(),

        // row 7
        statementCashFlowMethod: $(".FinStateTable tr").eq(7).find('td').eq(0).find('strong').text(),
        statementDate: $(".FinStateTable tr").eq(7).find('td').eq(1).find('span').text()
      }


      const balanceSheet = $("#TBilansStanja > tbody > tr").map(function (i, el) {
        const key = $(el).find('td').eq(2).text();

        if (key !== "") {
          return {
            key: key,
            value: $(el).find('td').eq(4).text()
          }
        }

        return null;
      }).get();

      const balanceSuccessSheet = $("#TBilansUspjeha > tbody > tr").map(function (i, el) {
        const key = $(el).find('td').eq(2).text();

        if (key !== "") {
          return {
            ordinal_number: key,
            description: $(el).find('td').eq(1).text(),
            current_year: $(el).find('td').eq(4).text(),
            last_year: $(el).find('td').eq(5).text(),
          }
        }

        return null;
      }).get();

      const balanceCashFlowSheet = $("#TIskazOTokovimaGotovine > tbody > tr").map(function (i, el) {
        const key = $(el).find('td').eq(1).text();

        if (key !== "") {
          return {
            key: key,
            value: $(el).find('td').eq(2).text()
          }
        }

        return null;
      }).get();

      const balanceStatsSheet = {}

      $("#TStatistickiAneks > tbody > tr").each(function (i, el) {
        const key = $(el).find('td').eq(2).text();

        if (key !== "") {
          balanceStatsSheet["field" + key] = $(el).find('td').eq(4).text();
        }
      });

      statement['balanceSheet'] = balanceSheet;
      statement['balanceSuccessSheet'] = balanceSuccessSheet;
      statement['balanceCashFlowSheet'] = balanceCashFlowSheet;
      statement['balanceStatsSheet'] = balanceStatsSheet;
    })
    .catch(response => {
      //handle error
      console.log("ERROR");
      console.log(response);
    });

  return statement;
};
