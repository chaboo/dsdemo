'use strict';

const https = require('https');
const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');

module.exports = async (data, context) => {
  const serviceUrl = "https://eprijava.tax.gov.me/TaxisPortal/FinancialStatement/TaxPayerStatementsList";
  const url = serviceUrl + '?PIB=' + data.companyId;

  var statements;

  const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

  const headers = {
    'Accept': '*/*',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  }

  const requestBody = {
    take: 100,
    skip: 0,
    page: 1,
    pageSize: 100
  }

  // IMPORTANT
  // https://github.com/nodejs/node/issues/9845
  // https://github.com/axios/axios/issues/1304
  const agent = new https.Agent({ ciphers: 'DES-CBC3-SHA' });

  await axios.post(url, formUrlEncoded(requestBody), { headers: headers, httpsAgent: agent })
    .then(response => {
      //handle success
      statements = response.data.data.map(function(el) {
        return {
          year: el.Year,
          statementId: el.FinStatementNumber
        }
      });
    })
    .catch(response => {
        //handle error
        console.log("ERROR");
        console.log(response);
    });

  return statements;
};
